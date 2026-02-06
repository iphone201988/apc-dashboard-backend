import { Document } from "mongoose";

export interface IHospice extends Document{
    choice:string;
    title:string
}