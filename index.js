import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./config/Database.js";
import userRouter from "./router/UserRouter.js";
// import User from "./models/UserModel.js";

try {
  await db.authenticate();
  console.log("Database connected...");
  // await User.sync();
} catch (error) {
  console.log(error);
}

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api", userRouter);

app.listen(port, () => console.log(`Server running at port ${port}`));
