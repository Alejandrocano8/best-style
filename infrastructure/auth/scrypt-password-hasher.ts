import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { PasswordHasher } from "@/domain/services/password-hasher";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export class ScryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derived = await scrypt(password, salt, KEY_LENGTH);
    return `scrypt:${salt}:${derived.toString("hex")}`;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const [scheme, salt, storedHash] = hash.split(":");
    if (scheme !== "scrypt" || !salt || !storedHash) return false;

    const derived = await scrypt(password, salt, KEY_LENGTH);
    const expected = Buffer.from(storedHash, "hex");

    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }
}
