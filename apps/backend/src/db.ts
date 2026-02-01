import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flint";

    await mongoose.connect(uri);

    console.log("[backend] MongoDB connected!");
}