const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// POST /api/bookings  (any logged-in user)
// Body: { tourId, numGuests }
exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId, numGuests } = req.body;

  if (!tourId || !numGuests) {
    return next(new AppError('tourId and numGuests are required.', 400));
  }
  if (numGuests < 1) {
    return next(new AppError('numGuests must be at least 1.', 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  // Atomically decrement seats only if enough are still available, so two
  // simultaneous bookings can't both succeed and overbook the tour.
  const updatedTour = await Tour.findOneAndUpdate(
    { _id: tourId, seatsAvailable: { $gte: numGuests } },
    { $inc: { seatsAvailable: -numGuests } },
    { new: true }
  );

  if (!updatedTour) {
    return next(new AppError(`Not enough seats available. Only ${tour.seatsAvailable} left.`, 400));
  }

  const booking = await Booking.create({
    user: req.user._id,
    tour: tourId,
    numGuests,
    totalPrice: tour.price * numGuests,
    status: 'pending',
  });

  res.status(201).json({
    status: 'success',
    data: { booking },
  });
});

// GET /api/bookings/my  (logged-in user's own bookings)
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('tour');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

// PATCH /api/bookings/:id/cancel  (owner or admin)
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID.', 404));
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to cancel this booking.', 403));
  }

  if (booking.status === 'cancelled') {
    return next(new AppError('This booking is already cancelled.', 400));
  }

  booking.status = 'cancelled';
  await booking.save();

  // Restore the seats this booking had taken.
  await Tour.findByIdAndUpdate(booking.tour, { $inc: { seatsAvailable: booking.numGuests } });

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

// GET /api/bookings  (admin only — all bookings, across all users)
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().populate('tour').populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

// PATCH /api/bookings/:id/status  (admin only)
// Body: { status: 'confirmed' | 'cancelled' }
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['confirmed', 'cancelled'].includes(status)) {
    return next(new AppError("Status must be 'confirmed' or 'cancelled'.", 400));
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID.', 404));
  }

  if (booking.status === 'cancelled') {
    return next(new AppError('This booking is already cancelled and cannot be changed further.', 400));
  }

  const wasAlreadyThisStatus = booking.status === status;
  booking.status = status;
  await booking.save();

  // If the admin is cancelling a still-active booking, give the seats back.
  if (status === 'cancelled' && !wasAlreadyThisStatus) {
    await Tour.findByIdAndUpdate(booking.tour, { $inc: { seatsAvailable: booking.numGuests } });
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});
