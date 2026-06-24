import express from "express";
import userRouter from "./routes/user.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import eventRouter from "./routes/events.routes.js";
import sessionRouter from "./routes/sessions.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "active", message: "Server is running correctly" });
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/events", eventRouter);
app.use("/api/sessions", sessionRouter);

export default app;
