import express from "express";
import validate from "../middleware/validate.middleware";
import authMiddleware from "../middleware/auth.middleware";
import dmeController from "../controllers/dme.controller";
import { createDmeSchema, deleteDmeSchema, getAllDmeSchema, updateDmeSchema } from "../validations/dme.validation";
import leadMiddleware from "../middleware/lead.middleware";
const dmeRouter = express.Router();

dmeRouter.post("/create",authMiddleware,leadMiddleware,validate(createDmeSchema),dmeController.createDME);
dmeRouter.get("/all",authMiddleware,validate(getAllDmeSchema),dmeController.getAllDME);
dmeRouter.delete("/delete/:id",authMiddleware,leadMiddleware,validate(deleteDmeSchema),dmeController.deleteDME);
dmeRouter.put("/update",authMiddleware,leadMiddleware,validate(updateDmeSchema),dmeController.updateDME);    

export default dmeRouter;