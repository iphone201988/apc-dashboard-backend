import { model, Schema } from "mongoose";
import { IReferrals } from "../types/referrals.types";
import { speciality, type } from "../utils/enums";


const referralsSchema = new Schema<IReferrals>({
    speciality: {
        type: String, enum: speciality,
        required: true
    },
    type: {
        type: String,enum:type,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const referralsModel = model<IReferrals>("referrals", referralsSchema);

export default referralsModel;