import { container } from "tsyringe";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentRepository";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import IUserRepository from "@modules/users/repositories/IUserRepository";

container.registerSingleton<IAppointmentRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  UsersRepository
);
