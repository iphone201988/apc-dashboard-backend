import { Document } from "mongoose";

export interface IWoundCare extends Document{
    insurance:string;
    provider:string
}