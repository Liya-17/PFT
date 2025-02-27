import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactions.js"; // ✅ Ensure correct import

dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("✅ Personal Finance Tracker API is running!");
  });
  

app.use(express.json());
app.use(cors());


   const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

app.use("/api/transactions", transactionRoutes); // ✅ Ensure transactions.js exports router properly

app.listen(5000, () => console.log("✅ Server running on port 5000"));
