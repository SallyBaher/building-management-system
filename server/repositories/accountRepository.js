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
    `SELECT
       "AccountID",
       "AccessLevel",
       "IsActive"
     FROM "ACCOUNT"
     WHERE "AccountID" = $1`,
    [accountId]
  );

  return result.rows[0] || null;
}

export async function findAllAccounts() {
  const result = await pool.query(
    `SELECT
       "AccountID",
       "FullName",
       "IDNumber",
       "MobileNumber",
       "AccessLevel",
       "IsActive"
     FROM "ACCOUNT"
     ORDER BY "AccountID" ASC`
  );

  return result.rows;
}

export async function updateAccount(
  accountId,
  fullName,
  idNumber,
  mobileNumber,
  accessLevel,
  isActive
) {
  const result = await pool.query(
    `UPDATE "ACCOUNT"
     SET
       "FullName" = $1,
       "IDNumber" = $2,
       "MobileNumber" = $3,
       "AccessLevel" = $4,
       "IsActive" = $5
     WHERE "AccountID" = $6
     RETURNING
       "AccountID",
       "FullName",
       "IDNumber",
       "MobileNumber",
       "AccessLevel",
       "IsActive"`,
    [
      fullName,
      idNumber,
      mobileNumber,
      accessLevel,
      isActive,
      accountId,
    ]
  );

  return result.rows[0] || null;
}

export async function createAccount(
  fullName,
  idNumber,
  mobileNumber,
  accessLevel
) {
  const result = await pool.query(
    `INSERT INTO "ACCOUNT"
      (
        "FullName",
        "IDNumber",
        "MobileNumber",
        "AccessLevel",
        "IsActive"
      )
     VALUES ($1, $2, $3, $4, false)
     RETURNING
       "AccountID",
       "FullName",
       "IDNumber",
       "MobileNumber",
       "AccessLevel",
       "IsActive"`,
    [
      fullName,
      idNumber,
      mobileNumber,
      accessLevel,
    ]
  );

  return result.rows[0];
}