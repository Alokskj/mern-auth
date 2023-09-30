import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import PassportSetup from "./config/passport-setup.js";
import session from "express-session";
import passport from "./config/passport-setup.js";
import cors from "cors"
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cors({
  origin : 'http://localhost:3000',
  methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,

}))
app.use(express.json());
app.use(
  session({ secret: "dfasfdjasdldj", resave: false, saveUninitialized: false })
);
app.use(passport.session());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "server is ready" }));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is running at port ${port}`));
