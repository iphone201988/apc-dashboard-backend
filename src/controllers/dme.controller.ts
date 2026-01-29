import { NextFunction, Request, Response } from "express";
import dmeModel from "../models/dme.model";


export const createDME = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { company, products, insurances } = req.body;
        const companyExists = await dmeModel.findOne({ company });
        if (companyExists) {
            return res.status(400).json({
                message: "DME Company already exists",
                success: false
            });
        }
        const dme = await dmeModel.create({ company, products, insurances });
        return res.status(201).json({
            message: "DME entry created successfully",
            success: true,
            data: dme
        });
    } catch (error) {
        next(error);
    }
}

export const getAllDME = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, company } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { company: { $regex: search, $options: "i" } },
                    { "products.title": { $regex: search, $options: "i" } },
                    { "insurances.title": { $regex: search, $options: "i" } }
                ]
            }
        }
        if (company) {
            filter = { ...filter, company: company }
        }
        const dmeEntries = await dmeModel.find(filter);
        return res.status(200).json({
            message: "DME entries fetched successfully",
            success: true,
            data: {dmeEntries}
        });
    } catch (error) {
        next(error);
    }
}

export const deleteDME = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedEntry = await dmeModel.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({
                message: "DME entry not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "DME entry deleted successfully",
            success: true
        });
    } catch (error) {
        next(error);
    }
}

export const updateDME = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, company, products, insurances } = req.body;
        const dmeEntry = await dmeModel.findById(id);
        if (!dmeEntry) {
            return res.status(404).json({
                message: "DME entry not found",
                success: false
            });
        }
        dmeEntry.company = company || dmeEntry.company;
        dmeEntry.products = products || dmeEntry.products;
        dmeEntry.insurances = insurances || dmeEntry.insurances;
        await dmeEntry.save();
        return res.status(200).json({
            message: "DME entry updated successfully",
            success: true,
            data:{
                dmeEntry
            }
        });
    } catch (error) {
        next(error);
    }
}

export default {
    createDME,
    getAllDME,
    deleteDME,
    updateDME
}