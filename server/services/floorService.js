import {
  findBuildingById,
  insertFloor
} from "../repositories/floorRepository.js";

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

  const building = await findBuildingById(buildingId);

  if (!building) {
    throw new FloorServiceError("Building not found.");
  }

  return insertFloor({
    buildingId,
    floorName: name
  });
}