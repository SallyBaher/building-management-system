import { getBuildingInformation } from "../services/buildingService.js";

export async function getBuilding(req, res, next) {
  try {
    const building = await getBuildingInformation();

    return res.status(200).json(building);
  } catch (error) {
    return next(error);
  }
}