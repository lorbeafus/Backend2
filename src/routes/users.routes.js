import { Router } from "express";
import { getAllUsers } from "../controllers/users.controllers.js";

const router = Router();

router.get("/", getAllUsers);

export default router;
