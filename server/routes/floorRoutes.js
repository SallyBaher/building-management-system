import { Router } from "express";
import {
  createFloor,
  FloorServiceError
} from "../services/floorService.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAccessLevel from "../middleware/authorizeAccessLevel.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  async (req, res, next) => {
    try {
      const result = await createFloor(req.body);

      return res.status(201).json({
        message: "Floor created successfully.",
        floor: result
      });
    } catch (error) {
      if (error instanceof FloorServiceError) {
        return res.status(400).json({
          message: error.message
        });
      }

      return next(error);
    }
  }
);

export default router;