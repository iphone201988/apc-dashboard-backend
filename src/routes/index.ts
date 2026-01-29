import express from "express";
import path from "path";
import userRouter from "./user.route";
import favouriteRouter from "./favourite.route";
import homeHealthRouter from "./homeHealth.route";
import dmeRouter from "./dme.route";
const router = express.Router();

router.use("/auth",userRouter)
router.use("/favourites",favouriteRouter);
router.use("/home-health",homeHealthRouter)
router.use("/dme",dmeRouter)

export default router;