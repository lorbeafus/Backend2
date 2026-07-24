import { Router } from "express";
import { getAll, create, update } from "../controllers/events.controllers.js";
import { authMiddleware, authorizeRoles, authorizeEventOwnerOrAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAll);
router.post("/", authMiddleware, authorizeRoles("organizer", "admin"), create);
router.put("/:id", authMiddleware, authorizeRoles("organizer", "admin"), authorizeEventOwnerOrAdmin, update);

export default router;
