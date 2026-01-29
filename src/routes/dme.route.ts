import express from "express";
import validate from "../middleware/validate.middleware";
import authMiddleware from "../middleware/auth.middleware";
import dmeController from "../controllers/dme.controller";
import { createDmeSchema, deleteDmeSchema, getAllDmeSchema, updateDmeSchema } from "../validations/dme.validation";
const dmeRouter = express.Router();

dmeRouter.post("/create",authMiddleware,validate(createDmeSchema),dmeController.createDME);
dmeRouter.get("/all",authMiddleware,validate(getAllDmeSchema),dmeController.getAllDME);
dmeRouter.delete("/delete/:id",authMiddleware,validate(deleteDmeSchema),dmeController.deleteDME);
dmeRouter.put("/update",authMiddleware,validate(updateDmeSchema),dmeController.updateDME);    

export default dmeRouter;