import { NextFunction, Request, Response } from "express";
import homeHealthModel from "../models/homeHealth.model";


const createHomeHealth = async (req: Request, res: Response, next: NextFunction) => {
    const { insurance, agency } = req.body;
    try {
        const newHomeHealth = new homeHealthModel({ insurance, agency });
        await newHomeHealth.save();
        return res.status(201).json({
            message: "Home Health entry created successfully",
            success: true,
            data: newHomeHealth
        });
    } catch (error) {
        next(error);
    }
}

const getAllHomeHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, agency, insurance } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { insurance: { $regex: search, $options: "i" } },
                    { agency: { $regex: search, $options: "i" } }
                ]
                
            }
        }
        if(agency){
            filter = { ...filter, agency: agency }
        }
        if(insurance){
            filter = { ...filter, insurance: insurance }
        }
        const homeHealthEntries = await homeHealthModel.find(filter);
        return res.status(200).json({
            message: "Home Health entries fetched successfully",
            success: true,
            data: homeHealthEntries
        });
    } catch (error) {
        next(error);
    }
}

const deleteHomeHealth=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params;
        const deletedEntry=await homeHealthModel.findByIdAndDelete(id);
        if(!deletedEntry){
            return res.status(404).json({
                message:"Home Health entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Home Health entry deleted successfully",
            success:true,
            data:deletedEntry
        });
    } catch (error) {
        next(error);
    }
}

const updateHomeHealth=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {insurance,agency,id}=req.body;
        const updatedEntry=await homeHealthModel.findByIdAndUpdate(id,{insurance,agency},{new:true});
        if(!updatedEntry){
            return res.status(404).json({
                message:"Home Health entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Home Health entry updated successfully",
            success:true,
            data:updatedEntry
        });
    } catch (error) {
        next(error);
    }
}
export default { createHomeHealth, getAllHomeHealth, deleteHomeHealth, updateHomeHealth };