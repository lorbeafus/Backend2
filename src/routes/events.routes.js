import { Router } from "express";
import { getAll, getById, create, update, updateStatus } from "../controllers/events.controllers.js";
import { createTicket, getEventTickets } from "../controllers/tickets.controllers.js";
import { authMiddleware, authorizeRoles, authorizeEventOwnerOrAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas de eventos
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authMiddleware, authorizeRoles("organizer", "admin"), create);
router.put("/:id", authMiddleware, authorizeRoles("organizer", "admin"), authorizeEventOwnerOrAdmin, update);
router.patch("/:id/status", authMiddleware, authorizeRoles("organizer", "admin"), authorizeEventOwnerOrAdmin, updateStatus);

// Rutas de tickets por evento
router.post("/:eid/tickets", authMiddleware, createTicket);
router.get("/:eid/tickets", authMiddleware, getEventTickets);

export default router;
