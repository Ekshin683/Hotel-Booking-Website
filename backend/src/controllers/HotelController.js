// Controller: HotelController
// Implement create/get/update/delete/list handlers for Hotel here.

import Hotel from 'models/Hotel';

exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('roomCategories');
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('roomCategories');
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.listHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .populate('roomCategories')
      .limit(100);
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.searchByLocation = async (req, res, next) => {
  try {
    const { city, country } = req.query;
    const query = {};
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (country) query['location.country'] = new RegExp(country, 'i');
    query.isActive = true;
    
    const hotels = await Hotel.find(query)
      .populate('roomCategories');
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.searchByAmenities = async (req, res, next) => {
  try {
    const { amenities } = req.query;
    const amenityList = Array.isArray(amenities) ? amenities : [amenities];
    
    const hotels = await Hotel.find({
      amenities: { $in: amenityList },
      isActive: true
    }).populate('roomCategories');
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.getTopRatedHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .sort({ ratingAverage: -1 })
      .limit(10)
      .populate('roomCategories');
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.updateRating = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { rating } = req.body;
    
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    
    const totalRating = (hotel.ratingAverage * hotel.ratingCount) + rating;
    hotel.ratingCount += 1;
    hotel.ratingAverage = totalRating / hotel.ratingCount;
    
    await hotel.save();
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};