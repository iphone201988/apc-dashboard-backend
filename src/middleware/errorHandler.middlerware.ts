import { Request, Response } from "express";
import { NextFunction } from "connect";
import ErrorHandler from "../utils/errorHandler";

export const getLanguage = (req: Request): any => {
  const langHeader = req.headers["accept-language"];
  if (langHeader?.toLowerCase().startsWith("ar")) return "ar";
  return "en";
};

export const errorMiddleware = async (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = getLanguage(req);

  // Default
  error.message = error.message ;
  error.statusCode = error.statusCode || 500;

  // JWT errors
  if (error.message === "jwt expired") {
    error.message = "JWT Expired";
    error.statusCode = 401;
  }
  if (error.message === "invalid signature") {
    error.message = "invalid signature";
    error.statusCode = 400;
  }

  // Mongo duplicate key error
  if ((error as any).code === 11000) {
    const key = Object.keys((error as any).keyPattern)[0];
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
    error.message = `${formattedKey} already exists`;
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
