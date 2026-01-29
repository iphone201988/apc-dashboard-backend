import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createHomeHealthSchema, getAllHomeHealthSchema, updateHomeHealthSchema } from "../validations/homeHealth.validation";
import homeHealthController from "../controllers/homeHealth.controller";

const homeHealthRouter = express.Router();

homeHealthRouter.post("/create", authMiddleware, validate(createHomeHealthSchema), homeHealthController.createHomeHealth)
homeHealthRouter.get("/all", authMiddleware,validate(getAllHomeHealthSchema), homeHealthController.getAllHomeHealth);
homeHealthRouter.delete("/delete/:id", authMiddleware, homeHealthController.deleteHomeHealth);
homeHealthRouter.put("/update", authMiddleware, validate(updateHomeHealthSchema), homeHealthController.updateHomeHealth);

export default homeHealthRouter;