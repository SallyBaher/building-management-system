import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import { issueOtp, OtpError, verifyOtp } from "../services/otpService.js";
import authenticate from "../middleware/authenticate.js";
const router = Router();

function isMissing(value) {
  return typeof value !== "string" || value.trim() === "";
}

function sendOtpError(res, error) {
  if (error.message === "No account is registered with this mobile number.") {
    return res.status(404).json({ message: "Account not found." });
  }

  if (error.message === "This account is inactive.") {
    return res.status(403).json({ message: "This account is inactive." });
  }

  return res.status(401).json({ message: "OTP verification failed." });
}

router.post("/request-otp", async (req, res, next) => {
  const { mobileNumber } = req.body;

  if (isMissing(mobileNumber)) {
    return res.status(400).json({ message: "mobileNumber is required." });
  }

  try {
    const otpDetails = await issueOtp(mobileNumber);

    // A future WhatsApp provider receives this payload at this boundary.
    const deliveryPayload = {
      mobileNumber: otpDetails.mobileNumber,
      otp: otpDetails.otp,
      expiresAt: otpDetails.expiresAt
    };
    void deliveryPayload;

    return res.status(200).json({
      message: "OTP issued successfully.",
      expiresAt: otpDetails.expiresAt.toISOString()
    });
  } catch (error) {
    if (error instanceof OtpError) {
      return sendOtpError(res, error);
    }

    return next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  const { mobileNumber, otp } = req.body;

  if (isMissing(mobileNumber)) {
    return res.status(400).json({ message: "mobileNumber is required." });
  }

  if (isMissing(otp)) {
    return res.status(400).json({ message: "otp is required." });
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    return res.status(500).json({ message: "JWT authentication is misconfigured." });
  }

  try {
    const accountId = await verifyOtp(mobileNumber, otp);
    const token = jwt.sign(
      { accountId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "OTP verified successfully.",
      token
    });
  } catch (error) {
    if (error instanceof OtpError) {
      return sendOtpError(res, error);
    }

    return next(error);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT "AccountID", "FullName", "IDNumber", "MobileNumber", "AccessLevel", "IsActive"
       FROM "ACCOUNT"
       WHERE "AccountID" = $1`,
      [req.account.accountId]
    );

    const account = result.rows[0];

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    return res.status(200).json(account);
  } catch (error) {
    return next(error);
  }
});

export default router;
