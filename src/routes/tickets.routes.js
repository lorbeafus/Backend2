import { Router } from "express";
import { getAllTickets } from "../controllers/tickets.controllers.js";

const router = Router();

router.get("/", getAllTickets);

export default router;
