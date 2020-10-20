import { injectable, inject } from "tsyringe";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUserRepository";
import IHashProvider from "../providers/models/IHashProvider";

import AppError from "@shared/errors/AppError";

interface Request {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) {
      throw new AppError("Email is already booked");
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
