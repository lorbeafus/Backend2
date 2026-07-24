import { Router } from "express";
import { getAllUsers } from "../controllers/users.controllers.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllUsers);

export default router;
