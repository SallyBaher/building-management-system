import {
  createInitialBuildingSetup,
  getInitialSetupStatus,
  InitialBuildingSetupError
} from "../services/buildingService.js";

export async function createInitialSetup(req, res, next) {
  try {
    const result = await createInitialBuildingSetup(req.body);

    return res.status(201).json({
      message: "Initial building setup completed successfully.",
      buildingId: result.buildingId,
      accountId: result.accountId
    });
  } catch (error) {
    if (error instanceof InitialBuildingSetupError) {
      return res.status(400).json({
        message: error.message
      });
    }

    return next(error);
  }
}

export async function getSetupStatus(req, res, next) {
  try {
    const result = await getInitialSetupStatus();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}