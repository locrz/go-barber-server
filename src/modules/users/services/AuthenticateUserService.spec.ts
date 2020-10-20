import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

describe("AuthenticateUser", () => {
  it("should be able to authenticate user with a valid credentials", async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository
    );

    await createUser.execute({
      email: "l@l.com",
      password: "123123",
      name: "John",
    });

    const authenticatedUser = await authenticateUserService.execute({
      email: "l@l.com",
      password: "123123",
    });

    expect(authenticatedUser).toHaveProperty("token");
  });

  it("should not be able to create a new appointment with email already registered", async () => {
    // const fakeUsersRepository = new FakeUsersRepository();
    // const authenticateUserService = new AuthenticateUserService(fakeUsersRepository);
    // const userEmail = "fake@email.com";
    // await authenticateUserService.execute({
    //   name: "Joao",
    //   email: userEmail,
    //   password: "123123",
    // });
    // expect(
    //   authenticateUserService.execute({
    //     name: "Joao",
    //     email: userEmail,
    //     password: "123123",
    //   })
    // ).rejects.toBeInstanceOf(AppError);
  });
});
