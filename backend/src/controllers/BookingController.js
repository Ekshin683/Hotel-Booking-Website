import Booking from 'models/Booking';
import Room from 'models/Room';
import Hotel from 'models/Hotel';

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    await booking.populate(['user', 'hotel', 'room']);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate(['user', 'hotel', 'room']);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate(['user', 'hotel', 'room']);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate(['user', 'hotel', 'room'])
      .limit(100);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate(['hotel', 'room']);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getHotelBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ hotel: req.params.hotelId })
      .populate(['user', 'room']);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', paymentStatus: 'refunded' },
      { new: true }
    ).populate(['user', 'hotel', 'room']);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed', paymentStatus: 'paid' },
      { new: true }
    ).populate(['user', 'hotel', 'room']);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};