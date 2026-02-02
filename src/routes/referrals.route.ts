import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import referralsController from "../controllers/referrals.controller";
import { createReferralSchema, getAllReferralsSchema, updateReferralSchema } from "../validations/referrals.validation";
const referralsRouter = express.Router();

referralsRouter.post("/create", authMiddleware, validate(createReferralSchema), referralsController?.createReferrals)
referralsRouter.get("/all", authMiddleware,validate(getAllReferralsSchema), referralsController?.getAllReferrals);
referralsRouter.delete("/delete/:id", authMiddleware,referralsController?.deleteReferrals);
referralsRouter.put("/update", authMiddleware, validate(updateReferralSchema), referralsController.updateReferral);

export default referralsRouter;