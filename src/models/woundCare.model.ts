import { model, Schema } from "mongoose";
import { IWoundCare } from "../types/woundcare.types";

const woundCareSchema = new Schema<IWoundCare>({
    insurance: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const woundCareModel = model<IWoundCare>("WoundCare", woundCareSchema)

export default woundCareModel;