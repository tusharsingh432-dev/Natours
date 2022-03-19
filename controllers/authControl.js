const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require(`./../models/userModel`);
const catchAsync = require(`./../utils/catchAsyncError`);
const AppError = require(`./../utils/appErrors`);
const catchAsyncError = require('./../utils/catchAsyncError');

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  //console.log((new Error()).stack.split("\n")[2].trim().split(" "));
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    status: `sucess`,
    token,
    user: newUser,
  });
});

exports.login = catchAsyncError(async (req, res, next) => {

  const { email, password } = req.body;
  console.log(`login`);
  if (!email || !password) {
    return next(new AppError('Please enter a valid email address and password', 400));
  }

  const user = await User.findOne({ email }).select(`+password`);

  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError('Please enter a valid email address and password', 400));
  };

  const token = createToken(user._id);
  res.status(200).json({
    status: `Sucess`,
    token
  })
});

exports.protect = catchAsyncError(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized access, Please Login first', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('User no longer exists', 401));
  }

  if (freshUser.passwordChanged(decoded.iat)) {
    // console.log(freshUser.passwordChanged(decoded.iat));
    return next(new AppError('Password changed recently, please login again', 401));
  }

  req.user = freshUser;

  next();
})