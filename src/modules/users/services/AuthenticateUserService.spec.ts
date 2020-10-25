import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to authenticate user with a valid credentials", async () => {
    const createdUser = await createUser.execute({
      email: "l@l.com",
      password: "123123",
      name: "John",
    });

    const authenticatedUser = await authenticateUserService.execute({
      email: "l@l.com",
      password: "123123",
    });

    expect(authenticatedUser).toHaveProperty("token");
    expect(authenticatedUser.user).toEqual(createdUser);
  });

  it("should not be able to authenticate with non existent user", async () => {
    authenticateUserService.execute({
      email: "l@l.com",
      password: "123123",
    });

    await expect(
      authenticateUserService.execute({
        email: "l@l.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await createUser.execute({
      email: "l@l.com",
      password: "123123",
      name: "John",
    });

    await expect(
      authenticateUserService.execute({
        email: "l@l.com",
        password: "111111",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
