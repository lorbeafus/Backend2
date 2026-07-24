import { passportCall } from "./passport.middleware.js";
import { eventsService } from "../services/events.services.js";

export const authMiddleware = passportCall("current");

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para realizar esta acción",
            });
        }
        next();
    };
};

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await eventsService.getEventById(id);
        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado",
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = event.organizer && event.organizer.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento",
            });
        }

        req.event = event;
        next();
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};
