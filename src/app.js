import express from "express";
import { connectDB } from "../database.js";
import { env } from "./config/env.js";
import userRouter from "./routers/user.routes.js";
import ticketRouter from "./routers/ticket.routes.js";
import eventRouter from "./routers/event.routes.js";
const app = express();

app.use("/api/user", userRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/event", eventRouter);

app.listen(env.PORT, () => {
    connectDB().then(() => {
        console.log("ok DB");
    }).catch(err => {
        console.error("DB connection error:", err);
    });
    console.log(`Server is running on port ${env.PORT}`);
});

