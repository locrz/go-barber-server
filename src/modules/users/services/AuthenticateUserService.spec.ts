import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";

describe("AuthenticateUser", () => {
  it("should be able to authenticate user with a valid credentials", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    authenticateUserService.execute({
      email: "l@l.com",
      password: "123123",
    });

    expect(
      authenticateUserService.execute({
        email: "l@l.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      email: "l@l.com",
      password: "123123",
      name: "John",
    });

    expect(
      authenticateUserService.execute({
        email: "l@l.com",
        password: "111111",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
