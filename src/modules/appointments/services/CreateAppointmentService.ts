import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Appointment from "../infra/typeorm/entities/Appointment";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

import AppError from "@shared/errors/AppError";

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const hasAppointmentOnSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (hasAppointmentOnSameDate) {
      throw new AppError("This appointment is already booked");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past hour");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You only can create an appointment between 8pm and 5pm."
      );
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormated = format(appointmentDate, "dd/MM/yyy 'às' HH:mm'h'");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
