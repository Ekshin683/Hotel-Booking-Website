// Promotion model placeholder
import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    value:{
        type:Number,
        required: true,
        min: 0,
    },
    currency:{
        type: String,
        trim: true,
        default: "USD",
    },
    maxDiscount:{
        type: Number,
        min: 0,
        default: 0,
    },
    usageLimit: {
        type: Number,
        min: 0,
    },
    perUserLimit: {
        type: Number,
        min: 0,
        default: 1,
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    startDate: {
        type: Date,
    },
    endDate:{
        type: Date,
    },
    applicableHotels:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
        },
    ],
    minBookingAmount:{
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isStackable: {
        type: Boolean,
        default: false,
    },
    eligibility: {
        type: {
            type: String,
            enum: ["all", "new_users", "loyalty_tier"],
        },
        criteria: {
            type: Object,
            default: {},
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
},
{timestamps: true});

promotionSchema.index({ code: 1 });

promotionSchema.pre("save", function (next) {
    if(this.code) this.code = this.code.toUpperCase().trim();
    next();
});

export default mongoose.model('Promotion', promotionSchema);