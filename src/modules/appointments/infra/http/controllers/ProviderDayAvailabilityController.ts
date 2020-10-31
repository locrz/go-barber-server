import { Request, Response } from "express";

import { container } from "tsyringe";

import ListProviderAvailabilityInDayService from "@modules/appointments/services/ListProviderAvailabilityInDayService";

export default class ProviderMonthAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { year, month, day } = request.body;

    const listProviderAvailabilityInDayService = container.resolve(
      ListProviderAvailabilityInDayService
    );

    const provider = await listProviderAvailabilityInDayService.execute({
      provider_id,
      day,
      year,
      month,
    });

    return response.json(provider);
  }
}
