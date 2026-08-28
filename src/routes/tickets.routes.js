import { Router } from "express";
import { getMyTickets, cancelTicket } from "../controllers/tickets.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/tickets/my-tickets -> Consultar tickets del usuario autenticado
router.get("/my-tickets", authMiddleware, getMyTickets);

// PATCH /api/tickets/:tid/cancel -> Cancelar ticket propio o por admin
router.patch("/:tid/cancel", authMiddleware, cancelTicket);

export default router;
