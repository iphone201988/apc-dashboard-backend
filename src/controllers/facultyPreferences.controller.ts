import { NextFunction, Request, Response } from "express";
import referralsModel from "../models/referrals.model";
import { SUCCESS } from "../utils/helpers";
import facultyPreferencesModel from "../models/facultyPreferences.model";



export const createFacultyPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { faculty, pharmacy, homeHealth, hospice } = req.body;
        const facultyPreference = await facultyPreferencesModel.findOne({ faculty, pharmacy, homeHealth, hospice });
        if (facultyPreference) {
            return SUCCESS(res, 201, "Referral Company already exists", {
                facultyPreference
            });
        }
        const facultyPreferenceData = await facultyPreferencesModel.create({ faculty, pharmacy, homeHealth, hospice });
        return res.status(201).json({
            message: "facultyPreference entry created successfully",
            success: true,
            data: facultyPreferenceData
        });
    } catch (error) {
        next(error);
    }
}

export const getAllFacultyPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { faculty: { $regex: search, $options: "i" } },
                    { pharmacy: { $regex: search, $options: "i" } },
                    { homeHealth: { $regex: search, $options: "i" } },
                    { hospice: { $regex: search, $options: "i" } },
                ]
            }
        }
        const
            facultyPreferences = await facultyPreferencesModel.find(filter);
        return res.status(200).json({
            message: "facultyPreferences entries fetched successfully",
            success: true,
            data: { facultyPreferences }
        });
    } catch (error) {
        next(error);
    }
}

export const deleteFacultyPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedEntry = await facultyPreferencesModel.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({
                message: "facultyPreference entry not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "facultyPreference entry deleted successfully",
            success: true
        });
    } catch (error) {
        next(error);
    }
}

export const updateFacultyPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { faculty, pharmacy, homeHealth, hospice, id } = req.body;
        const facultyPreference = await facultyPreferencesModel.findById(id);
        if (!facultyPreference) {
            return res.status(404).json({
                message: "facultyPreference entry not found",
                success: false
            });
        }
        facultyPreference.faculty = faculty || facultyPreference.faculty;
        facultyPreference.pharmacy = pharmacy || facultyPreference.pharmacy;
        facultyPreference.homeHealth = homeHealth || facultyPreference.homeHealth;
        facultyPreference.hospice = hospice || facultyPreference.hospice;
        await facultyPreference.save();
        return res.status(200).json({
            message: "facultyPreference entry updated successfully",
            success: true,
            data: {
                facultyPreference
            }
        });
    } catch (error) {
        next(error);
    }
}





export default {
    createFacultyPreferences,
    updateFacultyPreferences,
    deleteFacultyPreferences,
    getAllFacultyPreferences
}