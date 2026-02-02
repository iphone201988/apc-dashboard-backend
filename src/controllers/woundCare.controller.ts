import { NextFunction, Request, Response } from "express";
import woundCareModel from "../models/woundCare.model";

const createWoundCare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { insurance, provider } = req.body;
        const newWoundCare = await woundCareModel.create({ insurance, provider })
        return res.status(201).json({
            message: "Wound Care entry created successfully",
            success: true,
            data: newWoundCare
        })
    } catch (error) {
        next(error);
    }
}

const getAllWoundCare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { insurance: { $regex: search, $options: "i" } },
                    { provider: { $regex: search, $options: "i" } }
                ]
            }
        }
        const woundCareEntries = await woundCareModel.find(filter);
        return res.status(200).json({
            message: "Wound Care entries fetched successfully",
            success: true,
            data: woundCareEntries
        })
    } catch (error) {
        next(error);
    }
}

const deleteWoundCare=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params;
        const deletedEntry=await woundCareModel.findByIdAndDelete(id);
        if(!deletedEntry){
            return res.status(404).json({
                message:"WoundCare entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"WoundCare entry deleted successfully",
            success:true,
            data:deletedEntry
        });
    } catch (error) {
        next(error);
    }
}

const updateWoundCare=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {insurance,provider,id}=req.body;
        const updatedEntry=await woundCareModel.findByIdAndUpdate(id,{insurance, provider},{new:true});
        if(!updatedEntry){
            return res.status(404).json({
                message:"WoundCare entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"WoundCare entry updated successfully",
            success:true,
            data:updatedEntry
        });
    } catch (error) {
        next(error);
    }
}


export default {
    createWoundCare,
    getAllWoundCare,
    deleteWoundCare,
    updateWoundCare
}