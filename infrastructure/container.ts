import { GetPrototypeData } from "@/application/use-cases/get-prototype-data";
import { LoginUser } from "@/application/use-cases/login-user";
import { RegisterClient } from "@/application/use-cases/register-client";
import { ScryptPasswordHasher } from "@/infrastructure/auth/scrypt-password-hasher";
import { PostgresAuthRepository } from "@/infrastructure/repositories/postgres-auth-repository";
import { PostgresPrototypeRepository } from "@/infrastructure/repositories/postgres-prototype-repository";

const authRepository = new PostgresAuthRepository();
const passwordHasher = new ScryptPasswordHasher();

export const getPrototypeData = new GetPrototypeData(new PostgresPrototypeRepository());
export const loginUser = new LoginUser(authRepository, passwordHasher);
export const registerClient = new RegisterClient(authRepository, passwordHasher);
