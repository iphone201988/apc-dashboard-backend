import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import hospiceController from "../controllers/hospice.controller";
import { createHospiceSchema, getAllHospiceSchema, updateHospiceSchema } from "../validations/hospice.validation";
import leadMiddleware from "../middleware/lead.middleware";

const hospiceRouter = express.Router();

hospiceRouter.post("/create", authMiddleware,leadMiddleware, validate(createHospiceSchema), hospiceController.createHospice)
hospiceRouter.get("/all", authMiddleware,validate(getAllHospiceSchema), hospiceController.getHospice);
hospiceRouter.delete("/delete/:id", authMiddleware,leadMiddleware, hospiceController.deleteHospice);
hospiceRouter.put("/update", authMiddleware,leadMiddleware, validate(updateHospiceSchema), hospiceController.updateHospice);

export default hospiceRouter;