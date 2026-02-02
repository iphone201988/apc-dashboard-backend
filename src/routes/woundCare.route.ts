import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import woundCareController from "../controllers/woundCare.controller";
import { createWoundCareSchema, getAllWoundCareSchema, updateWoundCareSchema } from "../validations/woundCare.validation";
const woundCareRouter = express.Router();

woundCareRouter.post("/create", authMiddleware, validate(createWoundCareSchema), woundCareController?.createWoundCare)
woundCareRouter.get("/all", authMiddleware,validate(getAllWoundCareSchema), woundCareController?.getAllWoundCare);
woundCareRouter.delete("/delete/:id", authMiddleware,woundCareController?.deleteWoundCare);
woundCareRouter.put("/update", authMiddleware, validate(updateWoundCareSchema), woundCareController.updateWoundCare);

export default woundCareRouter;