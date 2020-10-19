import { Request, Response } from "express";
import { container } from "tsyringe";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import UsersRepository from "../../typeorm/repositories/UsersRepository";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const usersRepository = new UsersRepository();
    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
