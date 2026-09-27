const Destination = require('../models/Destination');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/destinations
exports.getAllDestinations = catchAsync(async (req, res, next) => {
  const destinations = await Destination.find();

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations },
  });
});

// GET /api/destinations/:id
exports.getDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { destination },
  });
});

// POST /api/destinations (admin only)
exports.createDestination = catchAsync(async (req, res, next) => {
  const { name, description, region, image } = req.body;

  if (!name || !description || !region) {
    return next(new AppError('Name, description and region are required.', 400));
  }

  const destination = await Destination.create({ name, description, region, image });

  res.status(201).json({
    status: 'success',
    data: { destination },
  });
});

// PATCH /api/destinations/:id (admin only)
exports.updateDestination = catchAsync(async (req, res, next) => {
  const { name, description, region, image } = req.body;

  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return next(new AppError('No destination found with that ID.', 404));
  }

  if (name !== undefined) destination.name = name;
  if (description !== undefined) destination.description = description;
  if (region !== undefined) destination.region = region;
  if (image !== undefined) destination.image = image;

  await destination.save();

  res.status(200).json({
    status: 'success',
    data: { destination },
  });
});

// DELETE /api/destinations/:id (admin only)
exports.deleteDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findByIdAndDelete(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
