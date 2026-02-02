import { model, Schema } from "mongoose";
import { IReferrals } from "../types/referrals.types";
import { IFacultyPreferences } from "../types/facultyPReferences.types";


const facultyPreferencesSchema = new Schema<IFacultyPreferences>({
    faculty: {
        type: String, 
        required: true
    },
    pharmacy: {
        type: String,
        required: true
    },
    homeHealth: {
        type: String,
        required: true
    },
    hospice: {
        type: String,
        required: true
    },
   
}, {
    timestamps: true
})

const facultyPreferencesModel = model<IFacultyPreferences>("facultyPreferences", facultyPreferencesSchema);

export default facultyPreferencesModel;