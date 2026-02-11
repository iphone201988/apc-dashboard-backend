import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import referralsController from "../controllers/referrals.controller";
import { createReferralSchema, getAllReferralsSchema, updateReferralSchema } from "../validations/referrals.validation";
import leadMiddleware from "../middleware/lead.middleware";
const referralsRouter = express.Router();

referralsRouter.post("/create", authMiddleware,leadMiddleware, validate(createReferralSchema), referralsController?.createReferrals)
referralsRouter.get("/all", authMiddleware,validate(getAllReferralsSchema), referralsController?.getAllReferrals);
referralsRouter.delete("/delete/:id", authMiddleware,leadMiddleware,referralsController?.deleteReferrals);
referralsRouter.put("/update", authMiddleware,leadMiddleware, validate(updateReferralSchema), referralsController.updateReferral);

export default referralsRouter;