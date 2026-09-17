import {
  getBuildingInformation,
  editBuildingInformation,
  InitialBuildingSetupError
} from "../services/buildingService.js";

export async function getBuilding(req, res, next) {
  try {
    const building = await getBuildingInformation();

    return res.status(200).json(building);
  } catch (error) {
    return next(error);
  }
}

export async function updateBuilding(req, res, next) {
  try {
    const updatedBuilding = await editBuildingInformation({
      buildingId: Number(req.body.buildingId),
      buildingName: req.body.buildingName,
      address: req.body.address,
      city: req.body.city,
      numberOfFloors: req.body.numberOfFloors,
      numberOfApartments: req.body.numberOfApartments,
      contactPhone: req.body.contactPhone,
      email: req.body.email,
      maintenanceFee: req.body.maintenanceFee
    });

    return res.status(200).json(updatedBuilding);
  } catch (error) {
    if (error instanceof InitialBuildingSetupError) {
      return res.status(400).json({
        message: error.message
      });
    }

    return next(error);
  }
}