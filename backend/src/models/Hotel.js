// Hotel model placeholder
import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    location:{
        city:{
            type: String,
            required: true,
            trom: true,
        },
        state:{
            type: String,
            trim: true,
        },
        country:{
            type: String,
            required: true,
            trim: true,
        },
        addressLine:{
            type: String,
            required: true,
            trim: true,
        },
        pincode:{
            type: Number,
            required: true,
        },
        coordinates:{
            lat: {type: Number},
            lng: {type: Number},
        },
    },
    amenities:{
        type: String,
        trime: true,
    },
    images:[
        {
            type: String,
            trim: true,
        },
    ],
    roomCategories:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        },
    ],
    contact:{
        phone:{
            type: Number,
            trim: true,
        },
        email:{
            type: String,
            trim: true,
            lowercase: true,
        },
    },
    checkInTime:{
        type: String,
        default: "00:00",
    },
    checkOutTime:{
        type: String,
        default: "00:00",
    },
    priceRange:{
        min:{type: Number, default: 0},
        max:{type: Number, default: 0},
    },
    rating:{
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    ratingCount:{
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
{timestamps: true});

hotelSchema.index({ "location.city": 1, "location.country": 1 });
hotelSchema.index({ amenities: 1 });
hotelSchema.index({ ratingAverage: -1 });

export default mongoose.model('Hotel', hotelSchema);