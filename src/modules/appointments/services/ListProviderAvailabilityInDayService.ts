import { inject, injectable } from "tsyringe";
import { getHours, isAfter } from "date-fns";

import IAppointmentRepository from "../repositories/IAppointmentRepository";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderAvailabilityInDayService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      }
    );

    const hourStart = 8;
    const currentDate = new Date(Date.now());

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      const isAvailable =
        !hasAppointmentInHour && isAfter(compareDate, currentDate);

      return {
        hour,
        available: isAvailable,
      };
    });

    return availability;
  }
}

export default ListProviderAvailabilityInDayService;
