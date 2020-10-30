import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import ListProvidersService from "./ListProvidersService";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it("should be able to list the providersđ", async () => {
    const user1 = await fakeUsersRepository.create({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    const user2 = await fakeUsersRepository.create({
      email: "joao@teste.com",
      password: "3432423",
      name: "Joao teste",
    });

    const loggedUser = await fakeUsersRepository.create({
      email: "jonn@log.com",
      password: "5432135",
      name: "Jon Tre",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});