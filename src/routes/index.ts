import express from "express";
import path from "path";
import userRouter from "./user.route";
const router = express.Router();

router.use("/auth",userRouter)



export default router;