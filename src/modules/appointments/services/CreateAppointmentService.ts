import { startOfHour } from "date-fns";

import AppointmentsRepository from "../infra/typeorm/repositories/AppointmentsRepository";
import Appointment from "../infra/typeorm/entities/Appointment";

import AppError from "@shared/errors/AppError";

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const hasAppointmentOnSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (hasAppointmentOnSameDate) {
      throw new AppError("This appointment is already booked");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
