import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerValidator, loginValidator, verifyEmailValidator } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
// import cors from "cors";

const authRouter = Router();

// app.use(cors());
 
authRouter.post("/register", registerValidator, validate, authController.register);
authRouter.post("/login", loginValidator, validate, authController.login);
authRouter.post("/verify-email", verifyEmailValidator, validate, authController.verifyEmail);
authRouter.post("/refresh-token", authController.refreshToken);

authRouter.get("/get-me", authMiddleware, authController.getMe);
authRouter.post("/logout", authController.logout);
authRouter.post("/logout-all", authController.logoutAll);
authRouter.get("/users", authMiddleware, authController.getAllUsers);

export default authRouter;