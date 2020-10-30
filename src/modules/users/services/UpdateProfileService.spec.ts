import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUProfileService: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to update user profile", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    const updated_user = await updateUProfileService.execute({
      user_id: user.id,
      email: "lucas@cruz.com",
      name: "Lucas Oliveira",
    });

    expect(updated_user.email).toBe("lucas@cruz.com");
    expect(updated_user.name).toBe("Lucas Oliveira");
  });

  it("should not be able to update user profile when user does not exists", async () => {
    await expect(
      updateUProfileService.execute({
        user_id: "wrong-user-id",
        email: "lucas@cruz.com",
        name: "Lucas Oliveira",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update user profile with existent email", async () => {
    await fakeUsersRepository.create({
      email: "test@test.com",
      name: "Test",
      password: "1321234",
    });

    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    await expect(
      updateUProfileService.execute({
        user_id: user.id,
        email: "test@test.com",
        name: "Lucas Oliveira",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update user profile and update password", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    const updated_user = await updateUProfileService.execute({
      user_id: user.id,
      email: "lucas@cruz.com",
      name: "Lucas Oliveira",
      old_password: "123123",
      password: "5432321",
    });

    expect(updated_user.email).toBe("lucas@cruz.com");
    expect(updated_user.name).toBe("Lucas Oliveira");
    expect(updated_user.password).toBe("5432321");
  });

  it("should not be able to update user profile whit wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    await expect(
      updateUProfileService.execute({
        user_id: user.id,
        email: "lucas@cruz.com",
        name: "Lucas Oliveira",
        old_password: "5432321",
        password: "5432321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update user profile whit not provided old password", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      name: "Lucas",
      password: "123123",
    });

    await expect(
      updateUProfileService.execute({
        user_id: user.id,
        email: "lucas@cruz.com",
        name: "Lucas Oliveira",
        password: "5432321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
