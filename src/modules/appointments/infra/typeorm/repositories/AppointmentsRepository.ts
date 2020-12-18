import Appointment from "../entities/Appointment";
import { getRepository, Raw, Repository } from "typeorm";
import IAppointmentRepository from "../../../repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IListProvidersAvailabilityInMonthDTO from "@modules/appointments/dtos/IListProvidersAvailabilityInMonthDTO";
import IListProvidersAvailabilityInDayDTO from "@modules/appointments/dtos/IListProvidersAvailabilityInDayDTO";

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const appointmentOnSameDate = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return appointmentOnSameDate;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IListProvidersAvailabilityInMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, "0");

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IListProvidersAvailabilityInDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, "0");
    const parsedMonth = String(month).padStart(2, "0");

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ["user"],
    });

    return appointments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
