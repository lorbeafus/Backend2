import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import usersRouter from "./routes/users.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import eventsRouter from "./routes/events.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "active", message: "Server is running correctly" });
});

// Routers
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
