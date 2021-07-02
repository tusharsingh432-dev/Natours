const jwt = require('jsonwebtoken');
const User = require(`./../models/userModel`);
const catchAsync = require(`./../utils/catchAsyncError`);

exports.signup = catchAsync(async (req, res, next) => {
  //console.log((new Error()).stack.split("\n")[2].trim().split(" "));
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });

  res.status(201).json({
    status: `sucess`,
    token,
    user: newUser,
  });
});
