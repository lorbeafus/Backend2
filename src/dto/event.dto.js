import { UserDTO } from "./user.dto.js";

export class EventResponseDTO {
    constructor(event) {
        if (!event) return;
        this.id = event._id ? event._id.toString() : event.id;
        this.title = event.title;
        this.description = event.description;
        this.category = event.category;
        this.date = event.date;
        this.location = event.location;
        this.capacity = event.capacity;
        this.price = event.price;
        this.status = event.status;
        if (event.level) this.level = event.level;

        if (event.organizer) {
            if (typeof event.organizer === "object" && (event.organizer._id || event.organizer.email)) {
                this.organizer = UserDTO.getFrom(event.organizer);
            } else {
                this.organizer = event.organizer.toString ? event.organizer.toString() : event.organizer;
            }
        }
    }

    static getFrom(event) {
        if (!event) return null;
        if (Array.isArray(event)) {
            return event.map((e) => new EventResponseDTO(e));
        }
        return new EventResponseDTO(event);
    }
}
