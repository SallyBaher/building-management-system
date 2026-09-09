import pool from "../db/pool.js";

export class FloorServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "FloorServiceError";
  }
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new FloorServiceError(`${fieldName} is required.`);
  }

  return value.trim();
}

export async function createFloor({
  buildingId,
  floorName
} = {}) {
  if (!Number.isInteger(buildingId) || buildingId <= 0) {
    throw new FloorServiceError("A valid buildingId is required.");
  }

  const name = requireString(floorName, "Floor name");

  const client = await pool.connect();

  try {
    const buildingResult = await client.query(
      `SELECT "BuildingID"
       FROM "BUILDING"
       WHERE "BuildingID" = $1`,
      [buildingId]
    );

    if (buildingResult.rowCount === 0) {
      throw new FloorServiceError("Building not found.");
    }

    const result = await client.query(
      `INSERT INTO "FLOOR"
       ("BuildingID", "FloorName")
       VALUES ($1, $2)
       RETURNING "FloorID", "BuildingID", "FloorName"`,
      [buildingId, name]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}