import { Router } from "express";
import {
  createInitialSetup,
  getSetupStatus
} from "../controllers/setupController.js";

const router = Router();

router.post("/initial", createInitialSetup);

router.get("/status", getSetupStatus);

export default router;