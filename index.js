import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import route from "./routes/posts_routes.js";
import userRoute from "./routes/user_routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.CONNECTION_URL;

// Middleware setup
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes setup
app.use("/posts", route);
app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.send("Hey There!!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
