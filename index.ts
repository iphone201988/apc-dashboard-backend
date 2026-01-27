import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import http from "http";
import mongoose from "mongoose"; // Add this import for closing the DB connection
import { errorMiddleware } from "./src/middleware/errorHandler.middlerware";
import { connectToDB } from "./src/utils/helpers";
import router from "./src/routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1", router);

app.use(errorMiddleware);

const port = process.env.PORT
connectToDB()
  .then(() => {
    console.log("Connected to DB successfully", process.env.MONGO_URI);

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`HTTP Server on ${port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        console.log("HTTP server closed.");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });



