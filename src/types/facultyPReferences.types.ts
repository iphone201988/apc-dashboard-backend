import { Document } from "mongoose";


export interface IFacultyPreferences extends Document {
    faculty: string;
    pharmacy: string;
    homeHealth: string;
    hospice: string;
}