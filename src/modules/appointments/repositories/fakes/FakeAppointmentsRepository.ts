import { uuid } from "uuidv4";
import { isEqual, getMonth, getYear } from "date-fns";

import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IListProvidersAvailabilityInMonthDTO from "@modules/appointments/dtos/IListProvidersAvailabilityInMonthDTO";

import Appointment from "../../infra/typeorm/entities/Appointment";

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async findAllProviderDaysInMonth({
    provider_id,
    month,
    year,
  }: IListProvidersAvailabilityInMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async create({ provider_id, date }: ICreateAppointmentDTO) {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, date });
    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
