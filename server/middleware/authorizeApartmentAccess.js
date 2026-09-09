import { ACCESS_LEVELS } from "../config/accessLevels.js";
import pool from "../db/pool.js";

export default async function authorizeApartmentAccess(req, res, next) {
  if (!req.account) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  const { apartmentId } = req.params;

  if (!apartmentId) {
    return res.status(400).json({ message: "An apartmentId route parameter is required." });
  }

  if (req.account.accessLevel === ACCESS_LEVELS.SUPER_ADMIN) {
    return next();
  }

  try {
    const result = await pool.query(
      `SELECT apartmentAccountRole."Role" AS "relationshipRole"
       FROM "APARTMENT_ACCOUNT" AS apartmentAccount
       INNER JOIN "APARTMENT_ACCOUNT_ROLE" AS apartmentAccountRole
         ON apartmentAccountRole."ApartmentAccountID" = apartmentAccount."ApartmentAccountID"
       WHERE apartmentAccount."ApartmentID" = $1
         AND apartmentAccount."AccountID" = $2
         AND apartmentAccountRole."IsActive" = TRUE
         AND apartmentAccountRole."StartDate" <= CURRENT_DATE
         AND (
           apartmentAccountRole."EndDate" IS NULL
           OR apartmentAccountRole."EndDate" >= CURRENT_DATE
         )
       LIMIT 1`,
      [apartmentId, req.account.accountId]
    );

    const relationship = result.rows[0];

    if (!relationship) {
      return res.status(403).json({
        message: "You are not authorized to access this apartment."
      });
    }

    req.apartmentRelationship = {
      apartmentId,
      role: relationship.relationshipRole
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
