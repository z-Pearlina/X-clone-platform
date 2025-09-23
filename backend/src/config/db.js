import mongoose from 'mongoose';
import {ENV} from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGODB_URI);
        console.log("Database connected successfully ✅");
    } catch (error) {
        console.log("Error connecting to the database:");
        process.exit(1);
    }
}