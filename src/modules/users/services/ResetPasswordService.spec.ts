// import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ResetPasswordService from "./ResetPasswordService";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe("ResetPassword", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it("should be able to reset password", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHashFunction = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPasswordService.execute({
      password: "321321",
      token: userToken.token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHashFunction).toBeCalledWith("321321");
    expect(updatedUser?.password).toBe("321321");
  });

  it("should not be able to reset password when given token is invalid", async () => {
    const userToken = await fakeUserTokensRepository.generate("invalidUserID");

    await expect(
      resetPasswordService.execute({
        password: "321321",
        token: userToken.token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset password when given token is invalid", async () => {
    await expect(
      resetPasswordService.execute({
        password: "321321",
        token: "invalidToken",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset password with expired token", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: "321321",
        token: userToken.token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
