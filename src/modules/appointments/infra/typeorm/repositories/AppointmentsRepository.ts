import Appointment from "../entities/Appointment";
import { getRepository, Raw, Repository } from "typeorm";
import IAppointmentRepository from "../../../repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IListProvidersAvailabilityInMonthDTO from "@modules/appointments/dtos/IListProvidersAvailabilityInMonthDTO";

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentOnSameDate = await this.ormRepository.findOne({
      where: { date },
    });
    return appointmentOnSameDate;
  }

  public async findAllProviderDaysInMonth({
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
            `to_char(${dateFieldName}) = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async create({ provider_id, date }: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
