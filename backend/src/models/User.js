// User model placeholder
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage: {
        type: String,
        trim: true,
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city:{
            type: Stirng,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        pincode:{
            type: String,
            trim: true,
        },
    },
    role: {
        type: String,
        enum: ["Customer", "Admin", "Staff"],
        default: "Customer",
    },
    loyaltyTier: {
        type: String,
        rnum : ["Bronze", "Silver", "Gold", "Platinum"],
        default: "Bronze",
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalBookings: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: 0,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isphoneVerified: {
        type: Boolean,
        default: false,
    },
    bookingHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
    ],
    savedHotels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
        },
    ],
    preferences: {
        currency:{
            type: String,
            default: "USD",
        },
        language: {
            type: String,
            default: "en",
        },
        notofications: {
            type: String,
            default: true,
        },
    },
    lastLogin: {
        type: Date,
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    metadata: {
        type: Object,
        default: {},
    },
},{timestamps: true});

userSchema.index({ email: 1});
userSchema.index({phone: 1});
userSchema.index({loyaltyTier: 1});

export default mongoose.model('User', userSchema);