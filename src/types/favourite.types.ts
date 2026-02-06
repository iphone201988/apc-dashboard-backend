import mongoose, { Document } from "mongoose";

export interface IFavouriteCategory extends Document{
    title:string;
    description?:string;
    themeColor?:string
}

export interface IFavouriteItemSchema extends Document{
    title:string,
    description:string,
    link:string,
    categoryId:mongoose.Types.ObjectId,
    icon?:string
}