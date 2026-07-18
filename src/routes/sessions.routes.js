import { Router } from "express";
import { getSession, registerUser, loginUser, logoutUser } from "../controllers/sessions.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/current", authMiddleware, getSession);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
