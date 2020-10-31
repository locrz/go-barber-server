import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IListProvidersAvailabilityInMonthDTO from "../dtos/IListProvidersAvailabilityInMonthDTO";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IListProvidersAvailabilityInMonthDTO
  ): Promise<Appointment[]>;
}
