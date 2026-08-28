import { UserDTO } from "./user.dto.js";
import { EventResponseDTO } from "./event.dto.js";

export class TicketResponseDTO {
    constructor(ticket) {
        if (!ticket) return;
        this.id = ticket._id ? ticket._id.toString() : ticket.id;
        this.quantity = ticket.quantity;
        this.reservationCode = ticket.reservationCode;
        this.status = ticket.status;
        this.createdAt = ticket.createdAt;
        this.cancelledAt = ticket.cancelledAt || null;

        if (ticket.user) {
            if (typeof ticket.user === "object" && (ticket.user._id || ticket.user.email)) {
                this.user = UserDTO.getFrom(ticket.user);
            } else {
                this.user = ticket.user.toString ? ticket.user.toString() : ticket.user;
            }
        }

        if (ticket.event) {
            if (typeof ticket.event === "object" && (ticket.event._id || ticket.event.title)) {
                this.event = EventResponseDTO.getFrom(ticket.event);
            } else {
                this.event = ticket.event.toString ? ticket.event.toString() : ticket.event;
            }
        }
    }

    static getFrom(ticket) {
        if (!ticket) return null;
        if (Array.isArray(ticket)) {
            return ticket.map((t) => new TicketResponseDTO(t));
        }
        return new TicketResponseDTO(ticket);
    }
}
