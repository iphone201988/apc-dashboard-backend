import { NextFunction, Request, Response } from "express";
import { roleType } from "../utils/enums";

const leadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role=req?.user?.role;
        if(role!==roleType.ADMIN || role!==roleType.LEAD){
            return res.status(400).json({
                message: "Only Admin or Lead can Perform this action",
                success: false
            })
        }

        next();
    }catch (error: any) {
    return res
      .status(error.statusCode || 401)
      .json({ success: false, message: error.message || "Internal Server Error" });
  }

}

export default leadMiddleware;