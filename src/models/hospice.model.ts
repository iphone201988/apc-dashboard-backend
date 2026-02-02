import { model, Schema } from "mongoose";
import { IHospice } from "../types/hospice.types";

const hospiceSchema = new Schema<IHospice>({
    choice: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const hospiceModel = model<IHospice>("Hospice", hospiceSchema)

export default hospiceModel;