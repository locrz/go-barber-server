import Appointment from "../entities/Appointment";
import { getRepository, Repository } from "typeorm";
import IAppointmentRepository from "../../../repositories/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

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

  public async create({ provider_id, date }: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
