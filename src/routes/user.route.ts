import express from "express";
import validate from "../middleware/validate.middleware";
import userController from "../controllers/user.controller";
import microsoftAuthController from "../controllers/microsoft-auth.controller";
import { updateUserRole } from "../validations/user.validation";
import { microsoftLoginSchema } from "../validations/microsoft-auth.validation";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";

const userRouter = express.Router();

// Microsoft Authentication (replaces old login/register/social-login)
userRouter.post("/login", validate(microsoftLoginSchema), microsoftAuthController.microsoftLogin);

// User Management Routes (kept from original)
userRouter.get("/profile", authMiddleware, userController.getProfile);
userRouter.put("/profile", authMiddleware, userController.updateProfile);
userRouter.get("/all", authMiddleware, userController.getAllUsers);
userRouter.post("/update-role", validate(updateUserRole), authMiddleware, adminMiddleware, userController.changeUserRole);
userRouter.post('/logout', authMiddleware, userController.accountLogout);

export default userRouter;