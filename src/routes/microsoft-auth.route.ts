import express from "express";
import validate from "../middleware/validate.middleware";
import microsoftAuthController from "../controllers/microsoft-auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import {
    microsoftLoginSchema,
    verifyTokenSchema,
} from "../validations/microsoft-auth.validation";

const microsoftAuthRouter = express.Router();

microsoftAuthRouter.post(
    "/login",
    validate(microsoftLoginSchema),
    microsoftAuthController.microsoftLogin
);

microsoftAuthRouter.post(
    "/verify-token",
    validate(verifyTokenSchema),
    microsoftAuthController.verifyMicrosoftToken
);

microsoftAuthRouter.get(
    "/profile",
    authMiddleware,
    microsoftAuthController.getProfile
);

export default microsoftAuthRouter;
