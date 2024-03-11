import { Router } from "express";
import { logOut, login, register } from "../controllers/register.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  register
);

router.route("/login").post(login);


router.route("/logout").post(verifyJWt,logOut)

export default router;
