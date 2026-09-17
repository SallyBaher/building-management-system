import pool from "../db/pool.js";

export async function getExistingBuilding(client) {
  const result = await client.query(
    'SELECT 1 FROM "BUILDING" LIMIT 1'
  );

  return result.rowCount > 0;
}

export async function getExistingSuperAdmin(client, accessLevel) {
  const result = await client.query(
    `SELECT 1
     FROM "ACCOUNT"
     WHERE "AccessLevel" = $1
     LIMIT 1`,
    [accessLevel]
  );

  return result.rowCount > 0;
}

export async function insertBuilding(client, building) {
  const result = await client.query(
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

  return result.rows[0];
}

export async function insertSuperAdmin(
  client,
  superAdmin,
  passwordHash,
  accessLevel
) {
  const result = await client.query(
    `INSERT INTO "ACCOUNT"
     (
       "FullName",
       "IDNumber",
       "MobileNumber",
       "Username",
       "PasswordHash",
       "AccessLevel",
       "IsActive"
     )
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     RETURNING "AccountID"`,
    [
      superAdmin.fullName,
      superAdmin.idNumber,
      superAdmin.mobileNumber,
      superAdmin.username,
      passwordHash,
      accessLevel
    ]
  );

  return result.rows[0];
}

export async function findInitialBuilding() {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM "BUILDING"
     ) AS "isInitialized"`
  );

  return result.rows[0].isInitialized;
}

export async function findBuildingInformation() {
  const result = await pool.query(
    `SELECT
       "BuildingID",
       "Name",
       "Address",
       "City",
       "NumberOfFloors",
       "NumberOfApartments",
       "ContactPhone",
       "Email",
       "MaintenanceFee"
     FROM "BUILDING"
     ORDER BY "BuildingID"
     LIMIT 1`
  );

  return result.rows[0] || null;
}

export async function updateBuilding(buildingId, building) {
  const result = await pool.query(
    `UPDATE "BUILDING"
     SET
       "Name" = $1,
       "Address" = $2,
       "City" = $3,
       "NumberOfFloors" = $4,
       "NumberOfApartments" = $5,
       "ContactPhone" = $6,
       "Email" = $7,
       "MaintenanceFee" = $8
     WHERE "BuildingID" = $9
     RETURNING
       "BuildingID",
       "Name",
       "Address",
       "City",
       "NumberOfFloors",
       "NumberOfApartments",
       "ContactPhone",
       "Email",
       "MaintenanceFee"`,
    [
      building.name,
      building.address,
      building.city,
      building.numberOfFloors,
      building.numberOfApartments,
      building.contactPhone,
      building.email,
      building.maintenanceFee,
      buildingId
    ]
  );

  return result.rows[0] || null;
}