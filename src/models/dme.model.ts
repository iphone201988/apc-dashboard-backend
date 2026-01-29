import { model, Schema } from "mongoose";
import { IDME, IProductSchema } from "../types/dme.types";

const productSchema=new Schema<IProductSchema>({
    title:{
        type:String,
        required:true
    },
    isLink:{
        type:Boolean,
        default:false
    },
    link:{
        type:String
    }
})
const dmeSchema=new Schema<IDME>({
    company:{
        type:String,
        required:true
    },
    products:productSchema,
    insurances:productSchema
})
const dmeModel=model<IDME>("DME",dmeSchema);

export default dmeModel;