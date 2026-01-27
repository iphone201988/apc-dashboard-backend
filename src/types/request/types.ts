import { ObjectId, Types } from "mongoose";
import { IUser } from "../user.types";
import { File } from "multer";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
    userId?: Types.ObjectId | string;
    language?: string;
    file?: File;
    files?: File[] | { [fieldname: string]: File[] };
  }
}

export {};
