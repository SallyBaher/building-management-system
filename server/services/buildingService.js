import pool from "../db/pool.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";
import { hashPassword } from "./passwordService.js";
import {
  getExistingBuilding,
  getExistingSuperAdmin,
  insertBuilding,
  insertSuperAdmin,
  findInitialBuilding,
  findBuildingInformation,
  updateBuilding
} from "../repositories/buildingRepository.js";

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

function requireBuildingId(buildingId) {
  if (!Number.isInteger(buildingId) || buildingId <= 0) {
    throw new InitialBuildingSetupError(
      "A valid building ID is required."
    );
  }

  return buildingId;
}

function requireNonNegativeNumber(value, fieldName) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isFinite(Number(value)) ||
    Number(value) < 0
  ) {
    throw new InitialBuildingSetupError(
      `${fieldName} must be a non-negative number.`
    );
  }

  return Number(value);
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
  mobileNumber,
  username,
  password
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
    mobileNumber: requireString(mobileNumber, "Mobile number"),
    username: requireString(username, "Username"),
    password: requireString(password, "Password")
  };
  const passwordHash = await hashPassword(superAdmin.password);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // These transaction-scoped locks serialize concurrent setup attempts.
    await client.query(
      'LOCK TABLE "BUILDING", "ACCOUNT" IN SHARE ROW EXCLUSIVE MODE'
    );

    const buildingAlreadyExists = await getExistingBuilding(client);

    if (buildingAlreadyExists) {
      throw new InitialBuildingSetupError(
        "Initial building setup has already been completed."
      );
    }

    const superAdminAlreadyExists = await getExistingSuperAdmin(
      client,
      ACCESS_LEVELS.SUPER_ADMIN
    );

    if (superAdminAlreadyExists) {
      throw new InitialBuildingSetupError(
        "A Super Admin account already exists."
      );
    }

    const buildingResult = await insertBuilding(client, building);

    const accountResult = await insertSuperAdmin(
      client,
      superAdmin,
      passwordHash,
      ACCESS_LEVELS.SUPER_ADMIN
    );

    await client.query("COMMIT");

    return {
      buildingId: buildingResult.BuildingID,
      accountId: accountResult.AccountID
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getInitialSetupStatus() {
  const isInitialized = await findInitialBuilding();

  return {
    isInitialized
  };
}

export async function getBuildingInformation() {
  const building = await findBuildingInformation();

  if (!building) {
    throw new InitialBuildingSetupError(
      "No building has been created yet."
    );
  }

  return building;
}

export async function editBuildingInformation({
  buildingId,
  buildingName,
  address,
  city,
  numberOfFloors,
  numberOfApartments,
  contactPhone,
  email,
  maintenanceFee
} = {}) {
  const validBuildingId = requireBuildingId(buildingId);

  const building = {
    name: requireString(buildingName, "Building name"),
    address: requireString(address, "Address"),
    city: requireString(city, "City"),
    numberOfFloors: requireNonNegativeInteger(
      Number(numberOfFloors),
      "Number of floors"
    ),
    numberOfApartments: requireNonNegativeInteger(
      Number(numberOfApartments),
      "Number of apartments"
    ),
    contactPhone: optionalString(contactPhone, "Contact phone"),
    email: optionalString(email, "Email"),
    maintenanceFee:
      maintenanceFee === undefined ||
      maintenanceFee === null ||
      maintenanceFee === ""
        ? null
        : requireNonNegativeNumber(
            maintenanceFee,
            "Maintenance fee"
          )
  };

  const updatedBuilding = await updateBuilding(
    validBuildingId,
    building
  );

  if (!updatedBuilding) {
    throw new InitialBuildingSetupError(
      "Building not found."
    );
  }

  return updatedBuilding;
}