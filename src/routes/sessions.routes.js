import { Router } from "express";
import { getSession, registerUser, loginUser, logoutUser } from "../controllers/sessions.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

router.get("/current", authMiddleware, getSession);
router.post("/register", passportCall("register"), registerUser);
router.post("/login", passportCall("login"), loginUser);
router.post("/logout", logoutUser);

export default router;
