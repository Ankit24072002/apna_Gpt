import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Correct CORS setup — must come BEFORE routes
app.use(cors({
  origin: ["https://apna-gpt.onrender.com", "https://apna-gpt-1.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Apna GPT Backend is running...");
});

// MongoDB connection + start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

startServer();
