import { model, Schema } from "mongoose";
import { IHomeHealth } from "../types/homeHealth.types";


const homeHeathSchema = new Schema<IHomeHealth>({
    insurance: {
        type: String,
        required: true
    },
    agency: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const homeHealthModel = model<IHomeHealth>("HomeHealth", homeHeathSchema);

export default homeHealthModel;