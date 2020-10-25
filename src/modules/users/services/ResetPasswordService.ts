import { injectable, inject } from "tsyringe";
import { differenceInHours } from "date-fns";

import IUsersRepository from "../repositories/IUserRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";
import IHashProvider from "../providers/models/IHashProvider";
import AppError from "@shared/errors/AppError";

interface Request {
  password: string;
  token: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ password, token }: Request): Promise<void> {
    const findToken = await this.userTokensRepository.findByToken(token);

    if (!findToken) {
      throw new AppError("Token not found.");
    }

    const user = await this.usersRepository.findById(findToken.user_id);

    if (!user) {
      throw new AppError("User not found.");
    }

    const tokenCreatedAt = findToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError("Token expired.");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
