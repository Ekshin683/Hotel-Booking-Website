// Controller: RoomController
// Implement create/get/update/delete/list handlers for Room here.
import Room from 'models/Room'

exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    await room.populate("hotel");
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("hotel");

    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate("hotel")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.getRoomsByHotel = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      isActive: true,
    }).sort({ roomNumber: 1 });

    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.searchRooms = async (req, res, next) => {
  try {
    const { hotelId, roomType, minPrice, maxPrice, guests } = req.query;

    const query = { isActive: true };
    if (hotelId) query.hotel = hotelId;
    if (roomType) query.roomType = roomType;
    if (guests) query["capacity.guests"] = { $gte: Number(guests) };

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query)
      .populate("hotel")
      .sort({ basePrice: 1 });

    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.updateRoomAvailability = async (req, res, next) => {
  try {
    const { date, isAvailable } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!date) return res.status(400).json({ message: "Date is required" });

    const targetDate = new Date(date);
    const existing = room.availability.find(
      (item) => new Date(item.date).toDateString() === targetDate.toDateString()
    );

    if (existing) {
      existing.isAvailable = Boolean(isAvailable);
    } else {
      room.availability.push({
        date: targetDate,
        isAvailable: Boolean(isAvailable),
      });
    }

    await room.save();
    res.json(room);
  } catch (err) {
    next(err);
  }
};