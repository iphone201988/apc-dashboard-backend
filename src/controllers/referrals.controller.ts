import { NextFunction, Request, Response } from "express";
import referralsModel from "../models/referrals.model";
import { SUCCESS } from "../utils/helpers";



export const createReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("createReferrals");
        const { speciality, type, provider, company, comments = "" } = req.body;
        const referrals = await referralsModel.findOne({ speciality, type, provider, company });
        if (referrals) {
            return SUCCESS(res, 201, "Referral Company already exists", {
                referrals
            });
        }
        const referral = await referralsModel.create({ speciality, type, provider, company, comments });
        return res.status(201).json({
            message: "Referral entry created successfully",
            success: true,              
            data: referral
        });
    } catch (error) {
        next(error);
    }
}

export const getAllReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, speciality, type } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { speciality: { $regex: search, $options: "i" } },
                    { type: { $regex: search, $options: "i" } },
                    { provider: { $regex: search, $options: "i" } },
                    { company: { $regex: search, $options: "i" } },
                    { comments: { $regex: search, $options: "i" } }
                ]
            }
        }
        if (type) {
            filter = { ...filter, type }
        }
        if (speciality) {
            filter = { ...filter, speciality }
        }
        const
            Referrals = await referralsModel.find(filter);
        return res.status(200).json({
            message: "referralsModel entries fetched successfully",
            success: true,
            data: { Referrals }
        });
    } catch (error) {
        next(error);
    }
}

export const deleteReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedEntry = await referralsModel.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({
                message: "Referral entry not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Referral entry deleted successfully",
            success: true
        });
    } catch (error) {
        next(error);
    }
}

export const updateReferral = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { speciality, type, provider, company, comments, id } = req.body;
        const referralsEntry = await referralsModel.findById(id);
        if (!referralsEntry) {
            return res.status(404).json({
                message: "referralsEntry entry not found",
                success: false
            });
        }
        referralsEntry.company = company || referralsEntry.company;
        referralsEntry.speciality = speciality || referralsEntry.speciality;
        referralsEntry.type = type || referralsEntry.type;
        referralsEntry.provider = provider || referralsEntry.provider;
        referralsEntry.comments = comments || referralsEntry.comments;
        await referralsEntry.save();
        return res.status(200).json({
            message: "referralsEntry entry updated successfully",
            success: true,
            data: {
                referralsEntry
            }
        });
    } catch (error) {
        next(error);
    }
}





export default {
    createReferrals,
    updateReferral,
    deleteReferrals,
    getAllReferrals
}