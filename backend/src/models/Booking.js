// Booking model placeholder
import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema(
    {
        user:{type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hotel:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        room:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Booked", "Cancelled", "Completed"],
            default: "Pending",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },
        reservationNumber: {
            type: String,
            unique: true,
        },
        specialRequests: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre("save", function (next) {
  if (!this.reservationNumber) {
    this.reservationNumber = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);