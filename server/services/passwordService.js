import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH);

  const derivedKey = await scrypt(
    password,
    salt,
    KEY_LENGTH
  );

  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, saltHex, hashHex] = storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !saltHex ||
    !hashHex
  ) {
    return false;
  }

  try {
    const expectedHash = Buffer.from(hashHex, "hex");

    const derivedKey = await scrypt(
      password,
      Buffer.from(saltHex, "hex"),
      expectedHash.length
    );

    return (
      expectedHash.length === derivedKey.length &&
      timingSafeEqual(expectedHash, derivedKey)
    );
  } catch {
    return false;
  }
}