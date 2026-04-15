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

// 1. Clean, standard CORS. No regex hacks needed.
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "https://modern-dashboard-smoky.vercel.app",
        credentials: true,
    })
);


// We put this BEFORE express.json() so Better Auth gets the raw request stream.
app.use("/api/auth", (req, res) => {
    // Express strips the mount path. We forcefully restore it here so
    // Better Auth knows exactly what route is being called.
    req.url = req.originalUrl;
    return toNodeHandler(auth)(req, res);
});

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