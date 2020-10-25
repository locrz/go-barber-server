import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe("UpdateUserAvatar", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it("should be able to update avatar", async () => {
    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    expect(user.avatar).toBe("avatar.jpg");
  });

  it("should not be able to update avatar from not existing user", async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: "123123",
        avatarFilename: "avatar.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update avatar and delete the old avatar when it exists", async () => {
    const deleteFileFunction = jest.spyOn(fakeStorageProvider, "deleteFile");

    const user = await fakeUsersRepository.create({
      email: "l@l.com",
      password: "123123",
      name: "Lucas",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: "avatar2.jpg",
    });

    expect(deleteFileFunction).toHaveBeenCalledWith("avatar.jpg");
    expect(user.avatar).toBe("avatar2.jpg");
  });
});
