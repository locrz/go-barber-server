import { injectable, inject } from "tsyringe";

import IUsersRepository from "../repositories/IUserRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";
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
    private mailProvider: IMailProvider,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (!findUser) {
      throw new AppError("User not found with given e-mail.");
    }

    const { token } = await this.userTokensRepository.generate(findUser.id);

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha recebido: ${token}`
    );
  }
}

export default CreateUserService;
