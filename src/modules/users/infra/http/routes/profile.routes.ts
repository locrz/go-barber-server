import { Router } from "express";
import { celebrate, Joi } from "celebrate";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import ProfileController from "../controllers/ProfileController";

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

profileRouter.get("/", profileController.show);
profileRouter.put(
  "/",
  celebrate({
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref("password")),
    },
  }),
  profileController.update
);

export default profileRouter;
