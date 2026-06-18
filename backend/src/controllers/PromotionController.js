// Controller: PromotionController
// Implement create/get/update/delete/list handlers for Promotion here.
import Promotion from 'models/Promotion';

exports.createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (err) {
    next(err);
  }
};

exports.getPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    next(err);
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    next(err);
  }
};

exports.deletePromotion = async (req, res, next) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ isActive: true })
      .limit(100);
    res.json(promotions);
  } catch (err) {
    next(err);
  }
};

exports.getPromotionByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });
    if (!promotion) return res.status(404).json({ message: 'Promotion code not found' });
    res.json(promotion);
  } catch (err) {
    next(err);
  }
};

exports.validatePromotion = async (req, res, next) => {
  try {
    const { code, bookingAmount, userId, hotelId } = req.body;
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });
    
    if (!promotion) {
      return res.status(400).json({ message: 'Invalid promotion code' });
    }
    
    const now = new Date();
    if (promotion.startDate && promotion.startDate > now) {
      return res.status(400).json({ message: 'Promotion not yet active' });
    }
    
    if (promotion.endDate && promotion.endDate < now) {
      return res.status(400).json({ message: 'Promotion has expired' });
    }
    
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Promotion usage limit reached' });
    }
    
    if (promotion.minBookingAmount && bookingAmount < promotion.minBookingAmount) {
      return res.status(400).json({ 
        message: `Minimum booking amount is ${promotion.minBookingAmount}` 
      });
    }
    
    if (hotelId && promotion.applicableHotels.length > 0) {
      if (!promotion.applicableHotels.includes(hotelId)) {
        return res.status(400).json({ message: 'Promotion not applicable for this hotel' });
      }
    }
    
    let discount = 0;
    if (promotion.type === 'percentage') {
      discount = (bookingAmount * promotion.value) / 100;
      if (promotion.maxDiscount) {
        discount = Math.min(discount, promotion.maxDiscount);
      }
    } else if (promotion.type === 'fixed') {
      discount = promotion.value;
    }
    
    res.json({
      valid: true,
      promotion,
      discountAmount: discount,
      finalAmount: bookingAmount - discount
    });
  } catch (err) {
    next(err);
  }
};

exports.applyPromotion = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });
    
    if (!promotion) {
      return res.status(400).json({ message: 'Invalid promotion code' });
    }
    
    promotion.usedCount += 1;
    await promotion.save();
    
    res.json({ message: 'Promotion applied successfully', promotion });
  } catch (err) {
    next(err);
  }
};

exports.getActivePromotions = async (req, res, next) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    });
    res.json(promotions);
  } catch (err) {
    next(err);
  }
};

exports.getPromotionStats = async (req, res, next) => {
  try {
    const stats = await Promotion.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgValue: { $avg: '$value' },
          totalUsed: { $sum: '$usedCount' }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};