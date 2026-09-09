import "dotenv/config";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

function getBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

export default async function authenticate(req, res, next) {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT authentication is not configured." });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }

  if (!payload || typeof payload !== "object" || !payload.accountId) {
    return res.status(401).json({ message: "Invalid authentication token." });
  }

  try {
    const result = await pool.query(
      `SELECT "AccountID", "AccessLevel", "IsActive"
       FROM "ACCOUNT"
       WHERE "AccountID" = $1`,
      [payload.accountId]
    );

    const account = result.rows[0];

    if (!account || account.IsActive !== true) {
      return res.status(401).json({ message: "This account is inactive or unavailable." });
    }

    req.account = {
      accountId: account.AccountID,
      accessLevel: account.AccessLevel,
      isActive: account.IsActive
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
