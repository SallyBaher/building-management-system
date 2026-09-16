import pool from "../db/pool.js";

export async function findAccountByUsername(username) {
  const result = await pool.query(
    `SELECT
       "AccountID",
       "PasswordHash",
       "IsActive"
     FROM "ACCOUNT"
     WHERE "Username" = $1`,
    [username]
  );

  return result.rows[0] || null;
}

export async function findAccountById(accountId) {
  const result = await pool.query(
    `SELECT
       "AccountID",
       "FullName",
       "IDNumber",
       "MobileNumber",
       "AccessLevel",
       "IsActive"
     FROM "ACCOUNT"
     WHERE "AccountID" = $1`,
    [accountId]
  );

  return result.rows[0] || null;
}

export async function findAuthenticationAccountById(accountId) {
  const result = await pool.query(
    `SELECT "AccountID", "AccessLevel", "IsActive"
     FROM "ACCOUNT"
     WHERE "AccountID" = $1`,
    [accountId]
  );

  return result.rows[0] || null;
}
