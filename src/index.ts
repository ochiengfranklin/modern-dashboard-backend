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

// import securityMiddleware from "./middleware/security.js";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

// --- 1. BULLETPROOF CORS CONFIG ---
// Guarantees no trailing slash, preventing strict string mismatch in the browser
const frontendUrl = (process.env.FRONTEND_URL || "https://modern-dashboard-smoky.vercel.app").replace(/\/$/, "");

app.use(
    cors({
        origin: [frontendUrl, "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // Required for cross-site cookies
    })
);

// Explicitly answer the browser's CORS "preflight" security checks
app.options("*", cors());
// ----------------------------------

// --- 2. THE FIX: Native RegExp to bypass the Express 5 crash ---
app.all(/^\/api\/auth/, toNodeHandler(auth));

app.use(express.json());

// app.use(securityMiddleware);

app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});