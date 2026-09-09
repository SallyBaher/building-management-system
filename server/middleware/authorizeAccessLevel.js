import { ACCESS_LEVEL_VALUES } from "../config/accessLevels.js";

export default function authorizeAccessLevel(...allowedAccessLevels) {
  const hasOnlyKnownAccessLevels = allowedAccessLevels.every((accessLevel) =>
    ACCESS_LEVEL_VALUES.includes(accessLevel)
  );

  if (allowedAccessLevels.length === 0 || !hasOnlyKnownAccessLevels) {
    throw new Error("authorizeAccessLevel must be configured with fixed access levels.");
  }

  return (req, res, next) => {
    if (!req.account) {
      return res.status(401).json({ message: "Authentication is required." });
    }

    if (req.account.isActive !== true) {
      return res.status(403).json({ message: "This account is inactive." });
    }

    if (!allowedAccessLevels.includes(req.account.accessLevel)) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    return next();
  };
}
