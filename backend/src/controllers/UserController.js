// Controller: UserController
// Implement create/get/update/delete/list handlers for User here.
import User from 'models/User';

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("bookingHistory savedHotels");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("bookingHistory savedHotels");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.addSavedHotel = async (req, res, next) => {
  try {
    const { userId, hotelId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedHotels: hotelId } },
      { new: true }
    ).populate("savedHotels");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.removeSavedHotel = async (req, res, next) => {
  try {
    const { userId, hotelId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedHotels: hotelId } },
      { new: true }
    ).populate("savedHotels");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateLoyalty = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { points = 0, amount = 0 } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.loyaltyPoints += Number(points);
    user.totalSpent += Number(amount);
    user.totalBookings += 1;

    if (user.loyaltyPoints >= 5000) user.loyaltyTier = "platinum";
    else if (user.loyaltyPoints >= 2500) user.loyaltyTier = "gold";
    else if (user.loyaltyPoints >= 1000) user.loyaltyTier = "silver";
    else user.loyaltyTier = "bronze";

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};