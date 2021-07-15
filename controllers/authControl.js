const jwt = require('jsonwebtoken');
const User = require(`./../models/userModel`);
const catchAsync = require(`./../utils/catchAsyncError`);
const AppError = require(`./../utils/appErrors`);
const catchAsyncError = require('./../utils/catchAsyncError');

const createToken = id =>{
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

  const {email, password} = req.body;
  console.log(`login`);
  if(!email || !password){
    return next(new AppError('Please enter a valid email address and password', 400));
  }

  const user = await User.findOne({email}).select(`+password`);

  if(!user || !user.correctPassword(password, user.password)){
    return next(new AppError('Please enter a valid email address and password', 400));
  };

  const token = createToken(user._id);
  res.status(200).json({
    status:`Sucess`,
    token
  })
});