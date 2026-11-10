import { GetPrototypeData } from "@/application/use-cases/get-prototype-data";
import { LoginUser } from "@/application/use-cases/login-user";
import { RegisterClient } from "@/application/use-cases/register-client";
import { CreateClient } from "@/application/use-cases/admin/create-client";
import { ManageAppointments } from "@/application/use-cases/admin/manage-appointments";
import { ManageServices } from "@/application/use-cases/admin/manage-services";
import { ManageUsers } from "@/application/use-cases/admin/manage-users";
import { ScryptPasswordHasher } from "@/infrastructure/auth/scrypt-password-hasher";
import { PostgresAdminRepository } from "@/infrastructure/repositories/postgres-admin-repository";
import { PostgresAuthRepository } from "@/infrastructure/repositories/postgres-auth-repository";
import { PostgresPrototypeRepository } from "@/infrastructure/repositories/postgres-prototype-repository";

const authRepository = new PostgresAuthRepository();
const adminRepository = new PostgresAdminRepository();
const passwordHasher = new ScryptPasswordHasher();

export const getPrototypeData = new GetPrototypeData(new PostgresPrototypeRepository());
export const loginUser = new LoginUser(authRepository, passwordHasher);
export const registerClient = new RegisterClient(authRepository, passwordHasher);
export const manageUsers = new ManageUsers(adminRepository, passwordHasher);
export const manageAppointments = new ManageAppointments(adminRepository);
export const manageServices = new ManageServices(adminRepository);
export const createClient = new CreateClient(adminRepository);
