import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactions.js"; // ✅ Ensure correct import
import admin from "firebase-admin";
import serviceAccount from "./firebaseAdminConfig.json"; // ✅ Add your Firebase Admin SDK JSON file
 import { readFile } from "node:fs/promises";  // Ensure "node:" prefix
const serviceAccount = JSON.parse(
  await readFile(new URL("./firebaseAdminConfig.json", import.meta.url))
);



dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("✅ Personal Finance Tracker API is running!");
});

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Firebase Admin SDK setup for authentication
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// ✅ Middleware to verify Firebase authentication token
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user details to the request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
};

// ✅ Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// ✅ Use authentication middleware for protected routes
app.use("/api/transactions", authenticate, transactionRoutes);

// ✅ Start the server only after DB connection
connectDB().then(() => {
    app.listen(5000, () => console.log("✅ Server running on port 5000"));
});
