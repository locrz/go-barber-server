import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUserService.execute({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new appointment with email already registered", async () => {
    const userEmail = "fake@email.com";

    await createUserService.execute({
      name: "Joao",
      email: userEmail,
      password: "123123",
    });

    await expect(
      createUserService.execute({
        name: "Joao",
        email: userEmail,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
