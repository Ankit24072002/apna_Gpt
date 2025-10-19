import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);


// Root route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Start server and connect to DB
const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB!");

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

startServer();
