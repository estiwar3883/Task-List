import mongoose from "mongoose";

const mongoDB_URI = process.env.mongoDB_URI;

if (!mongoDB_URI) {
  throw new Error("mongoDB_URI is not defined in environment variables");
}

export const connectBD = async () => {
    try {

        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        await mongoose.connect(mongoDB_URI);
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
};