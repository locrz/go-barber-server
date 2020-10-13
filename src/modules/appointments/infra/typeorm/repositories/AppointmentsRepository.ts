import Appointment from "../entities/Appointment";
import { EntityRepository, Repository } from "typeorm";
import IAppointmentRepository from "../../repositories/IAppointmentRepository";

@EntityRepository(Appointment)
class AppointmentsRepository
  extends Repository<Appointment>
  implements IAppointmentRepository {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentOnSameDate = await this.findOne({ where: date });
    return appointmentOnSameDate;
  }
}

export default AppointmentsRepository;
