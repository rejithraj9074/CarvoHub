// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import carWashRoutes from "./routes/carWashRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminMechanicRoutes from "./routes/adminMechanicRoutes.js";
import accessoryRoutes from "./routes/accessoryRoutes.js";
import accessoryOrderRoutes from "./routes/accessoryOrderRoutes.js";
import storefrontRoutes from "./routes/storefrontRoutes.js";

// Load environment variables
dotenv.config();

// Debug: confirm .env is loaded
console.log("Loaded Mongo URI:", process.env.MONGO_URI || "❌ Not found");

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // parse JSON
app.use(cors()); // enable CORS

// Serve uploaded images statically
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/carwash", carWashRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/mechanics", adminMechanicRoutes);
app.use("/api/admin/accessories", accessoryRoutes);
app.use("/api/admin/accessory-orders", accessoryOrderRoutes);
app.use("/api", storefrontRoutes);

// Health check / default route
app.get("/", (req, res) => {
  res.send("🚀 CarvoHub Backend API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
