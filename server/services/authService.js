import jwt from "jsonwebtoken";
import {
  findAccountById,
  findAccountByUsername
} from "../repositories/accountRepository.js";
import { verifyPassword } from "./passwordService.js";

export async function loginUser(username, password) {
  const account = await findAccountByUsername(username.trim());

  if (!account || account.IsActive !== true) {
    return null;
  }

  const passwordIsValid = await verifyPassword(
    password,
    account.PasswordHash
  );

  if (!passwordIsValid) {
    return null;
  }

  const token = jwt.sign(
    { accountId: account.AccountID },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  return token;
}

export async function getAccountById(accountId) {
  return findAccountById(accountId);
}
