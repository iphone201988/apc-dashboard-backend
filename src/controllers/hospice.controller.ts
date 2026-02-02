import { NextFunction, Request, Response } from "express";
import hospiceModel from "../models/hospice.model";

const createHospice=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {title,choice}=req.body;
        const newHospice=await hospiceModel.create({title,choice})
        return res.status(201).json({
            message:"Hospice entry created successfully",
            success:true,
            data:newHospice
        })  
    }catch(error){
        next(error);
    }   
}

const getHospice=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const search=req.query.search;
        let filter={};
        if(search){
            filter={
                $or:[
                    {title:{$regex:search,$options:"i"}},
                    {choice:{$regex:search,$options:"i"}}
                ]
            }
        }
        const hospiceEntries=await hospiceModel.find(filter);
        return res.status(200).json({
            message:"Wound Care entries fetched successfully",
            success:true,
            data:hospiceEntries
        })  
    }catch(error){
        next(error);
    }
}

const deleteHospice=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params;
        const deletedEntry=await hospiceModel.findByIdAndDelete(id);
        if(!deletedEntry){
            return res.status(404).json({
                message:"Hospice entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Hospice entry deleted successfully",
            success:true,
            data:deletedEntry
        });
    } catch (error) {
        next(error);
    }
}

const updateHospice=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {title,choice,id}=req.body;
        const updatedEntry=await hospiceModel.findByIdAndUpdate(id,{title,choice},{new:true});
        if(!updatedEntry){
            return res.status(404).json({
                message:"Hospice entry not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Hospice entry updated successfully",
            success:true,
            data:updatedEntry
        });
    } catch (error) {
        next(error);
    }
}


export default {
    createHospice,
    getHospice,
    updateHospice,
    deleteHospice

}