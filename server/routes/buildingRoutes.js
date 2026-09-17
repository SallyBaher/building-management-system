import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorizeAccessLevel from "../middleware/authorizeAccessLevel.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";
import {
  getBuilding,
  updateBuilding
} from "../controllers/buildingController.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getBuilding
);

router.put(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  updateBuilding
);

export default router;