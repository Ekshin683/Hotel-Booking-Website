// Room model placeholder
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    roomNumber:  {
        type: String,
        required: true,
        trim: true,
    },
    roomType: {
        type: String,
        enum: ["Single", "Double", "Suite", "Deluxe","Presidential"],
        required: true,
    },
    category: {
        typee: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    capacity: {
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        beds: {
            type: Number,
            required: true,
            min: 1,
        },
        bedType: {
            type: String,
            trim: true,
        },
    },
    basePrice: {
        type: Number,
        required: true,
        min : 0,
    },
    currency: {
        type: String,
        default: "USD",
        trim: true,
    },
    seasonalPricing: {
        season:{
            type: String,
            trim: true,
        },
        startDate: {
            Date,
        },
        endDate: {
            type: Date,
        },
        price: {
            type: Number,
            min: 0,
        },
    },
    amenities: [
        {
            type: String,
            trim: true,
        },
    ],
    images: [
        {
            type: String,
            trim: true,
        },
    ],
    floor: {
        type: Number,
        min: 0,
    },
    view: {
        type: String,
        trim: true,
    },
    availability: [
        {
            date: Date,
            isAvailable: {
                type: Boolean,
                default: true,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    features: {
        wifi: {
            type: Boolean,
            default: true,
        },
        ac: {
            type: Boolean,
            default: true,
        },
        balcony: {
            type: Boolean,
            default: false,
        },
        kitchenette: {
            type: Boolean,
            default: false,
        },
        bathhub: {
            type: Boolean,
            default: false,
        },
        shower: {
            type: Boolean,
            default: true,
        },
    },
    metadata: {
        type: Object,
        default: {},
    },
},{timestamps: true});

roomSchema.index({hotel: 1,roomNumber: 1});
roomSchema.index({roomType: 1, isActive: 1});
roomSchema.index({"availability.date": 1, "availability.isAvailable": 1});

export default mongoose.model("Room", roomSchema);