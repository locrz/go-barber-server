import { Router } from "express";
import { container } from "tsyringe";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import UsersRepository from "../../typeorm/repositories/UsersRepository";

const sessionsRouter = Router();

sessionsRouter.post("/", async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();
  const authenticateUserService = container.resolve(AuthenticateUserService);

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
