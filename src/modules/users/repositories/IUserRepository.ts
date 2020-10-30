import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IListProvidersDTO from "../dtos/IListProvidersDTO";
import User from "../infra/typeorm/entities/User";

export default interface IUserRepository {
  findAllProviders(data: IListProvidersDTO): Promise<User[]>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
