const Tour = require('../models/Tour');
const Destination = require('../models/Destination');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/tours?destination=<id>
exports.getAllTours = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.destination) filter.destination = req.query.destination;

  const tours = await Tour.find(filter).populate('destination', 'name slug region');

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// GET /api/tours/:id
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('destination');

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// POST /api/tours (admin only)
exports.createTour = catchAsync(async (req, res, next) => {
  const { title, destination, description, price, duration, date, seatsAvailable, image } = req.body;

  if (!title || !destination || !description || price === undefined || !duration || !date || seatsAvailable === undefined) {
    return next(
      new AppError('title, destination, description, price, duration, date and seatsAvailable are required.', 400)
    );
  }

  const destinationExists = await Destination.findById(destination);
  if (!destinationExists) {
    return next(new AppError('No destination found with that ID.', 400));
  }

  const tour = await Tour.create({
    title,
    destination,
    description,
    price,
    duration,
    date,
    seatsAvailable,
    image,
  });

  res.status(201).json({
    status: 'success',
    data: { tour },
  });
});

// PATCH /api/tours/:id (admin only)
exports.updateTour = catchAsync(async (req, res, next) => {
  const { title, destination, description, price, duration, date, seatsAvailable, image } = req.body;

  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  if (destination !== undefined) {
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return next(new AppError('No destination found with that ID.', 400));
    }
    tour.destination = destination;
  }

  if (title !== undefined) tour.title = title;
  if (description !== undefined) tour.description = description;
  if (price !== undefined) tour.price = price;
  if (duration !== undefined) tour.duration = duration;
  if (date !== undefined) tour.date = date;
  if (seatsAvailable !== undefined) tour.seatsAvailable = seatsAvailable;
  if (image !== undefined) tour.image = image;

  await tour.save();

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// DELETE /api/tours/:id (admin only)
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
