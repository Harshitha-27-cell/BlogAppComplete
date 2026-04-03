import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonAPI.js";
import cors from "cors";

config(); // load env

const app = exp();

// CORS (IMPORTANT for deployment)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://your-frontend-url.onrender.com", // replace after frontend deploy
    ],
    credentials: true,
  })
);

// middlewares
app.use(exp.json());
app.use(cookieParser());

// routes
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

// DB connection + server start
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    const PORT = process.env.PORT || 4000; //  IMPORTANT FIX

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log(" Error in DB connection", err);
  }
};

connectDB();

// invalid routes
app.use((req, res) => {
  res.status(404).json({ message: `${req.url} is invalid path` });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.log("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode =
    err.code ?? err.cause?.code ?? err.errorResponse?.code;

  const keyValue =
    err.keyValue ??
    err.cause?.keyValue ??
    err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});