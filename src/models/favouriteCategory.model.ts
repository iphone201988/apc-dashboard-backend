import { model, Schema } from "mongoose";
import { IFavouriteCategory } from "../types/favourite.types";


const favouriteCategorySchema= new Schema<IFavouriteCategory>(
    {
        title:{type:String,required:true},
        description:{type:String}
    },
    { timestamps: true }

)
const FavouriteCategoryModel=model<IFavouriteCategory>("FavouriteCategory",favouriteCategorySchema);

export default FavouriteCategoryModel