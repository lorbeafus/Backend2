import { Router } from "express";
import { getAll } from "../controllers/event.controllers.js";

const router = Router();

router.get("/", getAll);

export default router;
