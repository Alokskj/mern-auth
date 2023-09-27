import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "server is ready" }));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is running at port ${port}`));
