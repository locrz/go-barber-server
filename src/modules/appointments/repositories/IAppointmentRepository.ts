import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IListProvidersAvailabilityInMonthDTO from "../dtos/IListProvidersAvailabilityInMonthDTO";
import IListProvidersAvailabilityInDayDTO from "../dtos/IListProvidersAvailabilityInDayDTO";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IListProvidersAvailabilityInMonthDTO
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IListProvidersAvailabilityInDayDTO
  ): Promise<Appointment[]>;
}
