import { Router } from "express";
import {
  createInitialBuildingSetup,
  getInitialSetupStatus,
  InitialBuildingSetupError
} from "../services/buildingService.js";

const router = Router();

router.post("/initial", async (req, res, next) => {
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
});

router.get("/status", async (req, res, next) => {
  try {
    const result = await getInitialSetupStatus();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;