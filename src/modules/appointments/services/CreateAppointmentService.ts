import { startOfHour } from "date-fns";
import { injectable, inject } from "tsyringe";

import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Appointment from "../infra/typeorm/entities/Appointment";

import AppError from "@shared/errors/AppError";

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const hasAppointmentOnSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (hasAppointmentOnSameDate) {
      throw new AppError("This appointment is already booked");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
