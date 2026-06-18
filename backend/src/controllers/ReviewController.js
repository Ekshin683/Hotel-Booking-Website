// Controller: ReviewController
// Implement create/get/update/delete/list handlers for Review here.
import Review from 'models/Review';
import Hotel from 'models/Hotel';

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    await review.populate(["user", "hotel", "booking"]);
    if (review.hotel) {
      const [stats] = await Review.aggregate([
        { $match: { hotel: review.hotel, isApproved: true } },
        {
          $group: {
            _id: "$hotel",
            avgRating: { $avg: "$rating" },
            total: { $sum: 1 },
          },
        },
      ]);

      if (stats) {
        await Hotel.findByIdAndUpdate(review.hotel, {
          ratingAverage: Number(stats.avgRating.toFixed(2)),
          ratingCount: stats.total,
        });
      }
    }

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate(["user", "hotel", "booking"]);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate([
      "user",
      "hotel",
      "booking",
    ]);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate(["user", "hotel"])
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByHotel = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      hotel: req.params.hotelId,
      isApproved: true,
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate(["hotel", "booking"])
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.flagReview = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true, flagReason: reason || "flagged by user" },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.respondToReview = async (req, res, next) => {
  try {
    const { text, respondedBy } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        hotelResponse: {
          text,
          respondedAt: new Date(),
          respondedBy,
        },
      },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};