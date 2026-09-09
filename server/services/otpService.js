import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import pool from "../db/pool.js";

const scrypt = promisify(scryptCallback);

export const OTP_EXPIRATION_MINUTES = 5;
const OTP_DIGITS = 6;
const OTP_HASH_KEY_LENGTH = 64;

export class OtpError extends Error {
  constructor(message) {
    super(message);
    this.name = "OtpError";
  }
}

function generateOtp() {
  const upperBound = 10 ** OTP_DIGITS;
  return randomInt(0, upperBound).toString().padStart(OTP_DIGITS, "0");
}

async function hashOtp(otp) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(otp, salt, OTP_HASH_KEY_LENGTH);

  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

async function matchesOtp(otp, storedHash) {
  const [algorithm, saltHex, hashHex] = storedHash.split("$");

  if (algorithm !== "scrypt" || !saltHex || !hashHex) {
    return false;
  }

  try {
    const expectedHash = Buffer.from(hashHex, "hex");
    const derivedKey = await scrypt(otp, Buffer.from(saltHex, "hex"), expectedHash.length);

    return expectedHash.length === derivedKey.length && timingSafeEqual(expectedHash, derivedKey);
  } catch {
    return false;
  }
}

async function findActiveAccountByMobile(client, mobileNumber) {
  const result = await client.query(
    `SELECT "AccountID", "IsActive"
     FROM "ACCOUNT"
     WHERE "MobileNumber" = $1
     FOR UPDATE`,
    [mobileNumber]
  );

  const account = result.rows[0];

  if (!account) {
    throw new OtpError("No account is registered with this mobile number.");
  }

  if (account.IsActive !== true) {
    throw new OtpError("This account is inactive.");
  }

  return account;
}

export async function issueOtp(mobileNumber) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = await findActiveAccountByMobile(client, mobileNumber);
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    await client.query(
      `UPDATE "ACCOUNT_OTP"
       SET "IsCurrent" = FALSE
       WHERE "AccountID" = $1
         AND "IsCurrent" = TRUE`,
      [account.AccountID]
    );

    await client.query(
      `INSERT INTO "ACCOUNT_OTP"
        ("AccountID", "OtpHash", "IssuedAt", "ExpiresAt", "ConsumedAt", "IsCurrent")
       VALUES ($1, $2, $3, $4, NULL, TRUE)`,
      [account.AccountID, otpHash, issuedAt, expiresAt]
    );

    await client.query("COMMIT");

    // A future WhatsApp delivery adapter receives this result; this service never sends or logs OTPs.
    return {
      accountId: account.AccountID,
      mobileNumber,
      otp,
      expiresAt
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function verifyOtp(mobileNumber, otp) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = await findActiveAccountByMobile(client, mobileNumber);
    const result = await client.query(
      `SELECT "AccountOtpID", "OtpHash", "ExpiresAt", "ConsumedAt", "IsCurrent"
       FROM "ACCOUNT_OTP"
       WHERE "AccountID" = $1
         AND "IsCurrent" = TRUE
       FOR UPDATE`,
      [account.AccountID]
    );

    const otpRecord = result.rows[0];

    if (!otpRecord || otpRecord.IsCurrent !== true || otpRecord.ConsumedAt !== null) {
      throw new OtpError("The OTP is invalid or has already been used.");
    }

    if (new Date(otpRecord.ExpiresAt) <= new Date()) {
      throw new OtpError("The OTP has expired.");
    }

    if (!(await matchesOtp(otp, otpRecord.OtpHash))) {
      throw new OtpError("The OTP is invalid.");
    }

    const consumedAt = new Date();

    await client.query(
      `UPDATE "ACCOUNT_OTP"
       SET "ConsumedAt" = $1,
           "IsCurrent" = FALSE
       WHERE "AccountOtpID" = $2
         AND "IsCurrent" = TRUE
         AND "ConsumedAt" IS NULL`,
      [consumedAt, otpRecord.AccountOtpID]
    );

    await client.query("COMMIT");

    return account.AccountID;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
