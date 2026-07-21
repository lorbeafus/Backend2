import { passportCall } from "./passport.middleware.js";

export const authMiddleware = passportCall("current");
