import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import facultyPreferencesController from "../controllers/facultyPreferences.controller";
import { createFacultyPreferencesSchema, deleteFacultyPreferencesSchema, getAllFacultyPreferencesSchema, updateFacultyPreferencesSchema } from "../validations/facultyPreference.validation";
const facultyPreferenceRouter = express.Router();

facultyPreferenceRouter.post("/create", authMiddleware, validate(createFacultyPreferencesSchema), facultyPreferencesController?.createFacultyPreferences)
facultyPreferenceRouter.get("/all", authMiddleware,validate(getAllFacultyPreferencesSchema), facultyPreferencesController?.getAllFacultyPreferences);
facultyPreferenceRouter.delete("/delete/:id", authMiddleware,facultyPreferencesController?.deleteFacultyPreferences);
facultyPreferenceRouter.put("/update", authMiddleware, validate(updateFacultyPreferencesSchema), facultyPreferencesController.updateFacultyPreferences);

export default facultyPreferenceRouter;