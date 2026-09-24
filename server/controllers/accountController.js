import {
  getAllAccounts,
  getAccountById,
  editAccount,
  addAccount,
} from "../services/accountService.js";

export async function getAccounts(req, res, next) {
  try {
    const accounts = await getAllAccounts();

    return res.status(200).json(accounts);
  } catch (error) {
    return next(error);
  }
}

export async function getAccount(req, res, next) {
  try {
    const accountId = Number(req.params.accountId);

    if (!Number.isInteger(accountId) || accountId <= 0) {
      return res.status(400).json({
        message: "Invalid account ID.",
      });
    }

    const account = await getAccountById(accountId);

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}

export async function updateAccount(req, res, next) {
  try {
    const accountId = Number(req.params.accountId);

    if (!Number.isInteger(accountId) || accountId <= 0) {
      return res.status(400).json({
        message: "Invalid account ID.",
      });
    }

    const {
      fullName,
      idNumber,
      mobileNumber,
      accessLevel,
      isActive,
    } = req.body;

    if (!fullName || !idNumber || !mobileNumber || !accessLevel) {
      return res.status(400).json({
        message: "Full name, ID number, mobile number and access level are required.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "IsActive must be true or false.",
      });
    }

    const updatedAccount = await editAccount(
      accountId,
      fullName,
      idNumber,
      mobileNumber,
      accessLevel,
      isActive
    );

    if (!updatedAccount) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    return res.status(200).json(updatedAccount);
  } catch (error) {
    return next(error);
  }
}

export async function createAccount(req, res, next) {
  try {
    const {
      fullName,
      idNumber,
      mobileNumber,
      accessLevel,
    } = req.body;

    if (
      !fullName ||
      !idNumber ||
      !mobileNumber ||
      !accessLevel
    ) {
      return res.status(400).json({
        message:
          "Full name, ID number, mobile number and access level are required.",
      });
    }

    const account = await addAccount(
      fullName,
      idNumber,
      mobileNumber,
      accessLevel
    );

    return res.status(201).json(account);
  } catch (error) {
    return next(error);
  }
}