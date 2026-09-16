import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  login,
  getMe
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);

router.get("/me", authenticate, getMe);

export default router;