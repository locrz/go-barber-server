import Appointment from "../entities/Appointment";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const appointmentOnSameDate = await this.findOne({ where: date });

    return appointmentOnSameDate || null;
  }
}

export default AppointmentsRepository;
