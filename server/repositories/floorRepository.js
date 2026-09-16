import pool from "../db/pool.js";

export async function findBuildingById(buildingId) {
  const result = await pool.query(
    `SELECT "BuildingID"
     FROM "BUILDING"
     WHERE "BuildingID" = $1`,
    [buildingId]
  );

  return result.rows[0] ?? null;
}

export async function insertFloor({ buildingId, floorName }) {
  const result = await pool.query(
    `INSERT INTO "FLOOR"
     ("BuildingID", "FloorName")
     VALUES ($1, $2)
     RETURNING "FloorID", "BuildingID", "FloorName"`,
    [buildingId, floorName]
  );

  return result.rows[0];
}