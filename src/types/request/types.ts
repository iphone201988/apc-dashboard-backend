import { ObjectId, Types } from "mongoose";
import { IUser } from "../user.types";


declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    userId?: any;
    language?: any;
    file?: any;
    files?:any
  }
}

export {};
