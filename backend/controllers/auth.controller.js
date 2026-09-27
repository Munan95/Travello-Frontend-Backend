const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const generateOtp = require('../utils/generateOtp');
const signToken = require('../utils/signToken');

const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN) || 10;

// Fake "send" of the OTP. No email service is configured for this toy
// project, so we just log it to the server console. It is also returned
// in the API response below so it's easy to test with Postman/curl.
// --> To go live, swap this for a real Nodemailer/SMTP call.
const sendOtp = (email, otp) => {
  console.log(`\n[OTP] Verification code for ${email}: ${otp} (expires in ${OTP_EXPIRES_MIN} min)\n`);
};

// POST /api/auth/register
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email and password are required.', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with that email already exists.', 400));
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpires,
  });

  sendOtp(user.email, otp);

  res.status(201).json({
    status: 'success',
    message: 'Registered successfully. Check the server console for your OTP and verify your account.',
    // Only exposed here because there's no real email service in this toy project.
    devOtp: otp,
    data: {
      userId: user._id,
      email: user.email,
    },
  });
});

// POST /api/auth/verify-otp
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Email and OTP are required.', 400));
  }

  const user = await User.findOne({ email }).select('+otp +otpExpires');
  if (!user) {
    return next(new AppError('No account found with that email.', 404));
  }

  if (user.isVerified) {
    return next(new AppError('This account is already verified.', 400));
  }

  if (!user.otp || user.otp !== otp) {
    return next(new AppError('Invalid OTP.', 400));
  }

  if (user.otpExpires < new Date()) {
    return next(new AppError('OTP has expired. Please request a new one.', 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Account verified successfully.',
    token,
  });
});

// POST /api/auth/resend-otp
exports.resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required.', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No account found with that email.', 404));
  }

  if (user.isVerified) {
    return next(new AppError('This account is already verified.', 400));
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  sendOtp(user.email, otp);

  res.status(200).json({
    status: 'success',
    message: 'A new OTP has been sent.',
    devOtp: otp,
  });
});

// POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (!user.isVerified) {
    return next(new AppError('Please verify your account with the OTP sent to your email before logging in.', 403));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// GET /api/auth/me
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
      },
    },
  });
});
