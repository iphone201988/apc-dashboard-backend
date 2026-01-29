import { Document } from "mongoose";

export interface IProductSchema extends Document{
    title:string;
    isLink:boolean;
    link:string
}

export interface IDME extends Document{
    company:string;
    products:IProductSchema[];
    insurances:IProductSchema[];
}