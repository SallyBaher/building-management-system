import pool from "../db/pool.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";

export class InitialBuildingSetupError extends Error {
  constructor(message) {
    super(message);
    this.name = "InitialBuildingSetupError";
  }
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new InitialBuildingSetupError(`${fieldName} is required.`);
  }

  return value;
}

function requireNonNegativeInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    throw new InitialBuildingSetupError(
      `${fieldName} must be a non-negative integer.`
    );
  }

  return value;
}

function optionalString(value, fieldName) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new InitialBuildingSetupError(`${fieldName} must be a string.`);
  }

  return value;
}

/**
 * Creates the first building and its sole Super Admin atomically.
 */
export async function createInitialBuildingSetup({
  buildingName,
  address,
  city,
  numberOfFloors,
  numberOfApartments,
  contactPhone,
  email,
  fullName,
  idNumber,
  mobileNumber
} = {}) {
  const building = {
    name: requireString(buildingName, "Building name"),
    address: requireString(address, "Address"),
    city: requireString(city, "City"),
    numberOfFloors: requireNonNegativeInteger(
      numberOfFloors,
      "Number of floors"
    ),
    numberOfApartments: requireNonNegativeInteger(
      numberOfApartments,
      "Number of apartments"
    ),
    contactPhone: optionalString(contactPhone, "Contact phone"),
    email: optionalString(email, "Email")
  };
  const superAdmin = {
    fullName: requireString(fullName, "Full name"),
    idNumber: requireString(idNumber, "ID number"),
    mobileNumber: requireString(mobileNumber, "Mobile number")
  };

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // These transaction-scoped locks serialize concurrent setup attempts.
    await client.query(
      'LOCK TABLE "BUILDING", "ACCOUNT" IN SHARE ROW EXCLUSIVE MODE'
    );

    const existingBuilding = await client.query(
      'SELECT 1 FROM "BUILDING" LIMIT 1'
    );

    if (existingBuilding.rowCount > 0) {
      throw new InitialBuildingSetupError(
        "Initial building setup has already been completed."
      );
    }

    const existingSuperAdmin = await client.query(
      `SELECT 1
       FROM "ACCOUNT"
       WHERE "AccessLevel" = $1
       LIMIT 1`,
      [ACCESS_LEVELS.SUPER_ADMIN]
    );

    if (existingSuperAdmin.rowCount > 0) {
      throw new InitialBuildingSetupError(
        "A Super Admin account already exists."
      );
    }

    const buildingResult = await client.query(
      `INSERT INTO "BUILDING"
       (
         "Name",
         "Address",
         "City",
         "NumberOfFloors",
         "NumberOfApartments",
         "ContactPhone",
         "Email"
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING "BuildingID"`,
      [
        building.name,
        building.address,
        building.city,
        building.numberOfFloors,
        building.numberOfApartments,
        building.contactPhone,
        building.email
      ]
    );

    const accountResult = await client.query(
      `INSERT INTO "ACCOUNT"
       ("FullName", "IDNumber", "MobileNumber", "AccessLevel", "IsActive")
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING "AccountID"`,
      [
        superAdmin.fullName,
        superAdmin.idNumber,
        superAdmin.mobileNumber,
        ACCESS_LEVELS.SUPER_ADMIN
      ]
    );

    await client.query("COMMIT");

    return {
      buildingId: buildingResult.rows[0].BuildingID,
      accountId: accountResult.rows[0].AccountID
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getInitialSetupStatus() {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM "BUILDING"
     ) AS "isInitialized"`
  );

  return {
    isInitialized: result.rows[0].isInitialized
  };
}