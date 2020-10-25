import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import SendMailForgotPasswordService from "./SendMailForgotPasswordService";

describe("SendMailForgotPassword", () => {
  it("should be able to send mail to recover password", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMailFunction = jest.spyOn(fakeMailProvider, "sendMail");

    const sendMailForgotPassword = new SendMailForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMailForgotPassword = new SendMailForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider
    );

    await expect(
      sendMailForgotPassword.execute({
        email: "l@l.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
