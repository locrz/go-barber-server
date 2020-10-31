import { injectable, inject } from "tsyringe";
import { getDate, getDaysInMonth } from "date-fns";

import User from "@modules/users/infra/typeorm/entities/User";
import IAppointmentRepository from "../repositories/IAppointmentRepository";

interface Request {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
}>;

@injectable()
class ListProviderAvailabilityInMonthService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: Request): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year }
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    const availability = eachDayArray.map((day) => {
      const appointmentsInDay = appointments.filter(
        (appointment) => getDate(appointment.date) === day
      );

      return {
        day,
        availability: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderAvailabilityInMonthService;