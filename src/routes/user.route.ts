import express from "express";
import validate from "../middleware/validate.middleware";
import userController from "../controllers/user.controller";
import { loginSchema, registerSchema, socialLoginSchema, updateUserRole } from "../validations/user.validation";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";

const userRouter = express.Router();

userRouter.post("/register", validate(registerSchema), userController.register);
userRouter.post("/login", validate(loginSchema), userController.loginUser);
userRouter.post("/social-login", validate(socialLoginSchema), userController.socialLogin);
userRouter.post("/forget-password", userController.forgetPassword);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.get("/profile", authMiddleware, userController.getProfile);
userRouter.put("/profile", authMiddleware, userController.updateProfile);
userRouter.post("/verify-email", userController.verifyUserEmail);
userRouter.get("/all", authMiddleware, userController.getAllUsers);
userRouter.post("/update-role", validate(updateUserRole), authMiddleware,adminMiddleware, userController.changeUserRole)
userRouter.post('/logout', authMiddleware, userController.accountLogout)

export default userRouter;