import('apminsight')
    .then(({ default: AgentAPI }) => AgentAPI.config())
    .catch(() => console.log('APM not available in this environment'));

import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";
import enrollmentsRouter from "./routes/enrollments.js";

import { auth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Clean, standard CORS .
app.use(
    cors({
        origin: [
            "https://modern-dashboard-smoky.vercel.app",
            "http://localhost:5173"
        ],
        credentials: true,
    })
);


// Safely intercept the route, restore the URL, and catch database/auth failures
app.use("/api/auth", async (req, res) => {
    try {
        // Restore the full URL so Better Auth knows what route is being requested
        req.url = req.originalUrl;
        await toNodeHandler(auth)(req, res);
    } catch (error) {
        // If the DB connection fails, the server will log it here instead of dying!
        console.error("🔥 CRITICAL AUTH ERROR 🔥:", error);
        res.status(500).json({ error: "Internal Server Error during Authentication" });
    }
});

app.use(express.json());

app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

// Explicitly binding to 0.0.0.0 is best practice for Railway deployments
app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`Server running at port ${PORT}`);
});