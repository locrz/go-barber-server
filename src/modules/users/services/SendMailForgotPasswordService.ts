import { injectable, inject } from "tsyringe";

import IUsersRepository from "../repositories/IUserRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";

interface Request {
  email: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (!findUser) {
      throw new AppError("User not found with given e-mail.");
    }

    this.mailProvider.sendMail(
      email,
      "Recebido email para recuperação de senha"
    );
  }
}

export default CreateUserService;
