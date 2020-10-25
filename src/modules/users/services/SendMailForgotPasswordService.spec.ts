import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import SendMailForgotPasswordService from "./SendMailForgotPasswordService";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendMailForgotPassword: SendMailForgotPasswordService;

describe("SendMailForgotPassword", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendMailForgotPassword = new SendMailForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it("should be able to send mail to recover password", async () => {
    const sendMailFunction = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: "Lucas",
      password: "123123",
      email: "l@l.com",
    });

    await sendMailForgotPassword.execute({
      email: "l@l.com",
    });

    expect(sendMailFunction).toHaveBeenCalled();
  });

  it("should not be able to recover password when user was not registered", async () => {
    await expect(
      sendMailForgotPassword.execute({
        email: "l@l.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to generate a user token to recover password", async () => {
    const generateFunction = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "Lucas",
      password: "123123",
      email: "l@l.com",
    });

    await sendMailForgotPassword.execute({
      email: "l@l.com",
    });

    expect(generateFunction).toHaveBeenCalledWith(user.id);
  });
});
