import { Document } from "mongoose";


export interface IReferrals extends Document {
    speciality: string;
    type: string;
    provider: string;
    company: string;
    comments: string;
}