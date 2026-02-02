import "dotenv/config";
import express from "express";
import { connectDB } from "./db";
import serversRoute from "./modules/servers/servers.routes";
import authRoute from "./modules/auth/auth.routes";
import cors from 'cors';
import { requireAuth } from "./middleware/auth.middleware";
import { bootstrapAdmin } from "./modules/auth/auth.bootstrap";
import { bootstrapAgent } from "./bootstrapAgent";

// Express App setup
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Routes Setup
app.use("/auth", authRoute);
app.use("/servers", requireAuth, serversRoute);

// Start function
async function start() {
    await connectDB();

    await bootstrapAdmin();
    await bootstrapAgent();

    app.listen(8080, () => {
        console.log("Backend listening on 8080");
    });
}

start();