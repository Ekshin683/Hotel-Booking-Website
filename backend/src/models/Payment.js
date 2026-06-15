// Payment model placeholder
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
    {
        booking:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        amount:{
            type: Number,
            required: true,
            min: 0,
        },
        currency:{
            type: String,
            required: true,
            min : 0,
        },
        method: {
            type: String,
            enum: ["card", "upi", "netbanking", "wallet", "cash"],
            required: true,
        },
        provider:{
            type: String,
            trim: true,
        },
        transactionId:{
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        status:{
            type: String,
            enum: ["Pending", "Completed", "Failed", "Refunded"],
            default: "Pending",
        },
        paidAt:{
            type: Date,
        },
        refundAmount:{
            type: Number,
            default: 0,
            min: 0
        },
        refundReason:{
            type: String,
            trim: true,
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
{timestamps: true});

export default mongoose.model("Payment", PaymentSchema);