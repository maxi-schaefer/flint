import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        version: { type: String, required: true },
        path: { type: String, required: true },
        jar: { type: String, required: true },
        port: { type: Number, required: true },
        maxPlayers: { type: Number, default: 20 },
        whitelist: { type: Boolean, default: false },
        onlineMode: { type: Boolean, default: true },
        minMemoryMb: { type: Number, default: 1024 },
        maxMemoryMb: { type: Number, default: 2048 },
        status: {
            type: String,
            enum: ["creating", "running", "stopped", "crashed"],
            default: "stopped"
        },
        ownerId: {
            type: String,
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

export const ServerModel = mongoose.model("Server", ServerSchema);