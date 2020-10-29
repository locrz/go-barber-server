import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to show the profile", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("Lucas");
    expect(profile.email).toBe("l@l.com");
  });

  it("should not be able to show the profile from non existing user", async () => {
    await expect(
      showProfile.execute({
        user_id: "non-existing-user-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
