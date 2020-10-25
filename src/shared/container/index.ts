import { container } from "tsyringe";

import "@modules/users/providers";
import "./providers";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentRepository";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import IUserRepository from "@modules/users/repositories/IUserRepository";

import UserTokensRepository from "@modules/users/infra/typeorm/repositories/UserTokensRepository";
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

container.registerSingleton<IAppointmentRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository
);
