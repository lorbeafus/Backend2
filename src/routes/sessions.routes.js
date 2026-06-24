import { Router } from "express";
import { getSession } from "../controllers/sessions.controllers.js";

const router = Router();

router.get("/", getSession);

export default router;
