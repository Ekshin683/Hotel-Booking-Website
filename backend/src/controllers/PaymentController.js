// Controller: PaymentController
// Implement create/get/update/delete/list handlers for Payment here.
import Payment from 'models/Payment';
import Booking from 'models/Booking';

exports.createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    await payment.populate(['booking', 'user']);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate(['booking', 'user']);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate(['booking', 'user']);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate(['booking', 'user'])
      .limit(100);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentsByUser = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.params.userId })
      .populate('booking');
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentsByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('user');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, method, transactionId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(400).json({ message: 'Booking not found' });
    
    const payment = await Payment.create({
      booking: bookingId,
      user: booking.user,
      amount,
      method,
      transactionId,
      status: 'paid',
      paidAt: new Date()
    });
    
    booking.paymentStatus = 'paid';
    await booking.save();
    
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, refundReason } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    payment.status = 'refunded';
    payment.refundAmount = refundAmount || payment.amount;
    payment.refundReason = refundReason;
    
    await payment.save();
    
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'refunded';
      await booking.save();
    }
    
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentStats = async (req, res, next) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};