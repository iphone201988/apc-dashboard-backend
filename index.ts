import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import fs from 'fs';
import https from "https";
import http from "http";
import { errorMiddleware } from "./src/middleware/errorHandler.middlerware";
import { connectToDB } from "./src/utils/helpers";
import router from "./src/routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../ssl/private.key"), 'utf8'),
  cert: fs.readFileSync(path.resolve(__dirname, "../ssl/certificate.crt"), 'utf8'),
  ca: fs.readFileSync(path.resolve(__dirname, "../ssl/ca_bundle.crt"), 'utf8'),
};
app.use("/api/v1", router);

app.use(errorMiddleware);

const port = process.env.PORT
connectToDB()
  .then(() => {
    console.log("Connected to DB successfully", process.env.MONGO_URI);

    // http.createServer(app).listen(port, () => {
    //   console.log(`HTTP Server on ${port}`);
    // });
     https.createServer(options, app).listen(8000, () => {
      console.log("HTTPS Server on 8000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });



