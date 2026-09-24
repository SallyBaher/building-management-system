import {
  findAllAccounts,
  findAccountById,
  updateAccount,
  createAccount,
} from "../repositories/accountRepository.js";

export async function getAllAccounts() {
  return await findAllAccounts();
}

export async function getAccountById(accountId) {
  return await findAccountById(accountId);
}

export async function editAccount(
  accountId,
  fullName,
  idNumber,
  mobileNumber,
  accessLevel,
  isActive
) {
  return await updateAccount(
    accountId,
    fullName,
    idNumber,
    mobileNumber,
    accessLevel,
    isActive
  );
}

export async function addAccount(
  fullName,
  idNumber,
  mobileNumber,
  accessLevel
) {
  return await createAccount(
    fullName,
    idNumber,
    mobileNumber,
    accessLevel
  );
}