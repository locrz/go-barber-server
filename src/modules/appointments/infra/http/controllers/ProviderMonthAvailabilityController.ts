import { Request, Response } from "express";

import { container } from "tsyringe";

import ListProviderAvailabilityInMonthService from "@modules/appointments/services/ListProviderAvailabilityInMonthService";

export default class ProviderMonthAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { year, month } = request.query;

    const listProviderAvailabilityInMonth = container.resolve(
      ListProviderAvailabilityInMonthService
    );

    const provider = await listProviderAvailabilityInMonth.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return response.json(provider);
  }
}
