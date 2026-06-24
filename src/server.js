import app from "./app.js";
import { connectDB } from "../database.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
    connectDB().then(() => {
        console.log("Database connected successfully");
    }).catch(err => {
        console.error("DB connection error:", err);
    });
    console.log(`Server is running on port ${env.PORT}`);
});
