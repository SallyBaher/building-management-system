import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorizeAccessLevel from "../middleware/authorizeAccessLevel.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";
import { getBuilding } from "../controllers/buildingController.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getBuilding
);

export default router;