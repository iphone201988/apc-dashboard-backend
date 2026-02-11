import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import woundCareController from "../controllers/woundCare.controller";
import { createWoundCareSchema, getAllWoundCareSchema, updateWoundCareSchema } from "../validations/woundCare.validation";
import leadMiddleware from "../middleware/lead.middleware";
const woundCareRouter = express.Router();

woundCareRouter.post("/create", authMiddleware,leadMiddleware, validate(createWoundCareSchema), woundCareController?.createWoundCare)
woundCareRouter.get("/all", authMiddleware,validate(getAllWoundCareSchema), woundCareController?.getAllWoundCare);
woundCareRouter.delete("/delete/:id", authMiddleware,leadMiddleware,woundCareController?.deleteWoundCare);
woundCareRouter.put("/update", authMiddleware,leadMiddleware, validate(updateWoundCareSchema), woundCareController.updateWoundCare);

export default woundCareRouter;