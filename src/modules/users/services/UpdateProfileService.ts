import { injectable, inject } from "tsyringe";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUserRepository";

import AppError from "@shared/errors/AppError";
import IHashProvider from "../providers/models/IHashProvider";

interface Request {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found.");
    }

    const userWithRegisteredEmail = await this.usersRepository.findByEmail(
      email
    );

    if (userWithRegisteredEmail && userWithRegisteredEmail.id !== user_id) {
      throw new AppError("This email is already in use by another user.");
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!oldPassword) {
        throw new AppError("You need to inform the old password.");
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError("The old password is wrong.");
      }

      user.password = password;
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
