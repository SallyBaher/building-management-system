import express from "express";
import {
  getAccounts,
  getAccount,
  updateAccount,
  createAccount,
} from "../controllers/accountController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAccessLevel from "../middleware/authorizeAccessLevel.js";
import { ACCESS_LEVELS } from "../config/accessLevels.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getAccounts
);

router.get(
  "/:accountId",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  getAccount
);

router.put(
  "/:accountId",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  updateAccount
);

router.post(
  "/",
  authenticate,
  authorizeAccessLevel(ACCESS_LEVELS.SUPER_ADMIN),
  createAccount
);

export default router;