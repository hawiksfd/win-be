import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 7070;

const konek = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}, authRoute);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}, productRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).json({
    succes: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

//Routes go here
app.all("*", (req, res) => {
  res.json({ "every thing": "is awesome" });
});

app.listen(PORT, () => {
  konek();
  console.log("Connected to Server!");
});
