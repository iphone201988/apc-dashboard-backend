import { model, Schema } from "mongoose";
import { IFavouriteItemSchema } from "../types/favourite.types";

const favouriteItemsSchema = new Schema<IFavouriteItemSchema>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "FavouriteCategory", required: true },
    icon: { type: String },
}, {
    timestamps: true
})

const FavouriteItemModel = model<IFavouriteItemSchema>("FavouriteItem", favouriteItemsSchema);

export default FavouriteItemModel