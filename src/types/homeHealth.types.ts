import { Document } from "mongoose";


export interface IHomeHealth extends Document {
    insurance: string;
    agency: string;
}