import express from "express";
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
} from "../controllers/assetController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAccessLevel from "../middleware/authorizeAccessLevel.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getAssets
);

router.post(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  createAsset
);

router.get(
  "/:assetId",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getAsset
);

router.put(
  "/:assetId",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  updateAsset
);

export default router;