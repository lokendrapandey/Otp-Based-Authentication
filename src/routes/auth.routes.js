import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// register api
authRouter.post("/register", authController.register );

// login api 
authRouter.post("/login", authController.login);

// get me api
authRouter.get("/get-me", authController.getme);

//get refresh token api
authRouter.get("/refresh-token", authController.refreshToken);

//logout api
authRouter.get("/logout", authController.logout);

//logout all api
authRouter.get("/logout-all", authController.logoutAll);

//otp verification 
authRouter.get("/verify-email", authController.verifyEmail);

// get all users
authRouter.get("/users", authController.getAllUsers);
export default authRouter;