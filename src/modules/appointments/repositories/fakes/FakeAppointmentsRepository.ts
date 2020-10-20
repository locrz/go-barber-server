import { uuid } from "uuidv4";
import { isEqual } from "date-fns";

import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from "../../infra/typeorm/entities/Appointment";

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async create({ provider_id, date }: ICreateAppointmentDTO) {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, date });
    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
