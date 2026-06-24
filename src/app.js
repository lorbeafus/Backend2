import express from "express";
import usersRouter from "./routes/users.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import eventsRouter from "./routes/events.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "active", message: "Server is running correctly" });
});

// Routers
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

export default app;
