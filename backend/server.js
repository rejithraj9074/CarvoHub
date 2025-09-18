import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminAuthRoutes);

app.get("/", (req, res) => {
  res.send("CarvoHub Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
