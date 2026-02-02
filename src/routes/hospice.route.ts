import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import hospiceController from "../controllers/hospice.controller";
import { createHospiceSchema, getAllHospiceSchema, updateHospiceSchema } from "../validations/hospice.validation";

const hospiceRouter = express.Router();

hospiceRouter.post("/create", authMiddleware, validate(createHospiceSchema), hospiceController.createHospice)
hospiceRouter.get("/all", authMiddleware,validate(getAllHospiceSchema), hospiceController.getHospice);
hospiceRouter.delete("/delete/:id", authMiddleware, hospiceController.deleteHospice);
hospiceRouter.put("/update", authMiddleware, validate(updateHospiceSchema), hospiceController.updateHospice);

export default hospiceRouter;