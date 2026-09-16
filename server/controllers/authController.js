import {
  loginUser,
  getAccountById
} from "../services/authService.js";

function isMissing(value) {
  return typeof value !== "string" || value.trim() === "";
}

export async function login(req, res, next) {
  const { username, password } = req.body;

  if (isMissing(username)) {
    return res.status(400).json({
      message: "username is required."
    });
  }

  if (isMissing(password)) {
    return res.status(400).json({
      message: "password is required."
    });
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    return res.status(500).json({
      message: "JWT authentication is misconfigured."
    });
  }

  try {
    const token = await loginUser(username, password);

    if (!token) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      token
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const account = await getAccountById(req.account.accountId);

    if (!account) {
      return res.status(404).json({
        message: "Account not found."
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}