import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authrouter from "./routes/auth.js";
import postrouter from "./routes/path.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/user", authrouter);
app.use("/api", postrouter);

mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((err) => {
    console.log("Error found:", err);
  });

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
