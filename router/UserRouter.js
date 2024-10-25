import {
  getUser,
  createUser,
  loginUser,
  logoutUser,
} from "../controller/UserController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import tokenVerify from "../middleware/AccessToken.js";
import express from "express";

const userRouter = express.Router();

userRouter
  .route("/user")
  .get(tokenVerify, getUser)
  .post(tokenVerify, createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/logout", logoutUser);
userRouter.get("/token", refreshToken);

export default userRouter;
