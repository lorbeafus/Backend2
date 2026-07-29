import { Schema, model } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
            default: "Online",
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "finished"],
            default: "draft",
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
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

export const eventModel = model("Event", eventSchema);