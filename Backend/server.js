import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS middleware - put it BEFORE routes
app.use(cors({
    origin: 'https://apna-gpt-1.onrender.com', // Replace with your live frontend URL
    credentials: true // needed if you use cookies/JWT
}));

// Middleware to parse JSON
app.use(express.json());

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
