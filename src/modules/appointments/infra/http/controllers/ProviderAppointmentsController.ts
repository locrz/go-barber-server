import { Request, Response } from "express";

import { container } from "tsyringe";

import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { year, month, day } = request.body;

    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService
    );

    const providerAppointments = await listProviderAppointmentsService.execute({
      provider_id,
      day,
      year,
      month,
    });

    return response.json(providerAppointments);
  }
}
