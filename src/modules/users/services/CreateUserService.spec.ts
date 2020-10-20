import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";

describe("CreateUser", () => {
  it("should be able to create a new user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new appointment with email already registered", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const userEmail = "fake@email.com";

    await createUserService.execute({
      name: "Joao",
      email: userEmail,
      password: "123123",
    });

    expect(
      createUserService.execute({
        name: "Joao",
        email: userEmail,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
