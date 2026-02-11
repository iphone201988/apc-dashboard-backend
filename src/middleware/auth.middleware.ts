import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/helpers";
import User from "../models/user.model";
import { AccountStatus, deviceType } from "../utils/enums";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "UNAUTHORIZED",
                success: false
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded: any = verifyToken(token);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "UNAUTHORIZED",
                success: false
            })
        }

        const user = await User.findById(decoded.id);
        console.log("user...",user)
        if (!user) {
            return res.status(401).json({
                message: "UNAUTHORIZED",
                success: false
            })
        }
        req.user = user;
        req.userId = user._id
        if (user.status === AccountStatus.SUSPENDED) {
            return res
                .status(401)
                .json({
                    message: "SUSPENDED ACCOUNT",
                    success: false
                });

        }

        next();
    }catch (error: any) {
    // Catch unexpected errors
    return res
      .status(error.statusCode || 401)
      .json({ success: false, message: error.message || "Internal Server Error" });
  }

}
export default authMiddleware;
