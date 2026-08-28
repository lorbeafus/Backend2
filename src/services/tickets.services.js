import { ticketsRepository } from "../repositories/tickets.repository.js";
import { eventsRepository } from "../repositories/events.repository.js";
import { sendMail } from "../config/mailer.config.js";
import crypto from "crypto";

export class TicketsService {
    generateReservationCode() {
        const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
        const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
        return `TCK-${randomPart}-${timestampPart}`;
    }

    async createTicket(eventId, user, quantity = 1) {
        const event = await eventsRepository.getById(eventId);
        if (!event) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (event.status !== "published") {
            const error = new Error("El evento no está disponible para inscripciones");
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();
        if (event.date <= now || event.status === "cancelled" || event.status === "finished") {
            const error = new Error("No es posible inscribirse a un evento cancelado o finalizado");
            error.statusCode = 400;
            throw error;
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
            const error = new Error("La cantidad de tickets debe ser un número mayor a 0");
            error.statusCode = 400;
            throw error;
        }

        // Validar si el usuario ya tiene un ticket activo para este evento
        const existingTicket = await ticketsRepository.findActiveByUserAndEvent(user._id, eventId);
        if (existingTicket) {
            const error = new Error("Ya tenés una inscripción activa para este evento");
            error.statusCode = 409;
            throw error;
        }

        // Control de cupos
        const reservedQuantity = await ticketsRepository.getReservedQuantity(eventId);
        const availableCapacity = event.capacity - reservedQuantity;

        if (qty > availableCapacity) {
            const error = new Error(
                `No hay cupos suficientes disponibles. Solicitados: ${qty}, Disponibles: ${Math.max(availableCapacity, 0)}`
            );
            error.statusCode = 400;
            throw error;
        }

        const reservationCode = this.generateReservationCode();

        const newTicket = await ticketsRepository.create({
            user: user._id,
            event: eventId,
            quantity: qty,
            reservationCode,
            status: "confirmed",
            cancelledAt: null,
        });

        // Enviar email de confirmación
        if (user.email) {
            sendMail({
                to: user.email,
                subject: `Confirmación de inscripción - ${event.title}`,
                html: `
                    <h1>¡Inscripción Confirmada!</h1>
                    <p>Hola <strong>${user.first_name || ""} ${user.last_name || ""}</strong>,</p>
                    <p>Tu inscripción para el evento <strong>${event.title}</strong> ha sido confirmada con éxito.</p>
                    <p><strong>Código de reserva:</strong> ${reservationCode}</p>
                    <p><strong>Cantidad de lugares:</strong> ${qty}</p>
                    <p><strong>Fecha del evento:</strong> ${new Date(event.date).toLocaleString()}</p>
                    <p><strong>Ubicación:</strong> ${event.location}</p>
                `,
                text: `Hola ${user.first_name || ""}, tu inscripción al evento "${event.title}" fue confirmada. Código de reserva: ${reservationCode}. Lugares: ${qty}.`,
            }).catch((err) => {
                console.error("Fallo al enviar correo asíncrono:", err.message);
            });
        }

        return newTicket;
    }

    async getMyTickets(userId) {
        return await ticketsRepository.getByUser(userId);
    }

    async getEventTickets(eventId, requestingUser) {
        const event = await eventsRepository.getById(eventId);
        if (!event) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const isAdmin = requestingUser.role === "admin";
        const isOwner =
            event.organizer &&
            (event.organizer._id
                ? event.organizer._id.toString() === requestingUser._id.toString()
                : event.organizer.toString() === requestingUser._id.toString());

        if (!isAdmin && !isOwner) {
            const error = new Error("No tenés permisos para ver los inscriptos de este evento");
            error.statusCode = 403;
            throw error;
        }

        return await ticketsRepository.getByEvent(eventId);
    }

    async cancelTicket(ticketId, requestingUser) {
        const ticket = await ticketsRepository.getById(ticketId);
        if (!ticket) {
            const error = new Error("Ticket no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const isAdmin = requestingUser.role === "admin";
        const ticketUserId = ticket.user?._id ? ticket.user._id.toString() : ticket.user?.toString();
        const isOwner = ticketUserId === requestingUser._id.toString();

        if (!isAdmin && !isOwner) {
            const error = new Error("No tenés permisos para cancelar este ticket");
            error.statusCode = 403;
            throw error;
        }

        if (ticket.status === "cancelled") {
            const error = new Error("El ticket ya está cancelado");
            error.statusCode = 400;
            throw error;
        }

        const eventDate = ticket.event?.date ? new Date(ticket.event.date) : null;
        if (eventDate && eventDate <= new Date()) {
            const error = new Error("No se puede cancelar una inscripción de un evento finalizado");
            error.statusCode = 400;
            throw error;
        }

        const updatedTicket = await ticketsRepository.update(ticketId, {
            status: "cancelled",
            cancelledAt: new Date(),
        });

        // Enviar email de notificación de cancelación
        const recipientEmail = ticket.user?.email || requestingUser.email;
        if (recipientEmail) {
            sendMail({
                to: recipientEmail,
                subject: `Cancelación de inscripción - ${ticket.event?.title || "Evento"}`,
                html: `
                    <h1>Inscripción Cancelada</h1>
                    <p>Tu inscripción con código de reserva <strong>${ticket.reservationCode}</strong> ha sido cancelada correctamente.</p>
                    <p>El cupo ha sido liberado.</p>
                `,
                text: `Tu inscripción con código ${ticket.reservationCode} ha sido cancelada correctamente.`,
            }).catch((err) => {
                console.error("Fallo al enviar correo de cancelación:", err.message);
            });
        }

        return updatedTicket;
    }
}

export const ticketsService = new TicketsService();
