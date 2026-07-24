import { Schema, model } from "mongoose";

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        data: {
            type: Date,
            required: true,
        },
        place: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: Boolean,
            default: true,
        },
        organizer: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const eventModel = model("event", eventSchema);