import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";

import CreateUserService from "@modules/users/services/CreateUserService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import uploadConfig from "@config/upload";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = container.resolve(CreateUserService);

  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);
    const { user, file } = request;

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: file.filename,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  }
);

export default usersRouter;
