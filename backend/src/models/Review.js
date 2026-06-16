// Review model placeholder
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    categories:{
        cleanliness: {
            type: Number,
            min: 1,
            max: 5,
        },
        comfort: {
            type: Number,
            min: 1,
            max: 5,
        },
        service:{
            type: Number,
            min: 1,
            max: 5,
        },
        value: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000,
    },
    images: [
        {
            type: String,
            trim: true,
        },
    ],
    iswVerifiedBooking: {
        type: Booolean,
        default: false,
    },
    helpful: {
        type:Number,
        default: 0,
        min: 0,
    },
    unhelpful: {
        type: Number,
        default: 0,
        min: 0,
    },
    hotelResponse: {
        text: {
            type: String,
            trim: true,
        },
        repondedAt: {
            type: Date,
        },
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isFlagged:{
        type: Boolean,
        default: false,
    },
    flagReason: {
        type: String,
        trim: true,
    },
},{timestamps: true});

reviewSchema.index({hotel: 1, rating: -1});
reviewSchema.index({user: 1, createdAt: -1});
reviewSchema.index({isApproved: 1});

export default mongoose.model(reviewSchema);