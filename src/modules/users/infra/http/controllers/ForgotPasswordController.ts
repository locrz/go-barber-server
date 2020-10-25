import { Request, Response } from "express";
import { container } from "tsyringe";

import SendMailForgotPasswordService from "@modules/users/services/SendMailForgotPasswordService";

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendMailForgotPassword = container.resolve(
      SendMailForgotPasswordService
    );

    await sendMailForgotPassword.execute({
      email,
    });

    return response.status(204).json();
  }
}
