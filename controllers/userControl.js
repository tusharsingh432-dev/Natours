const AppError = require('../utils/appErrors');
const catchAsyncError = require('../utils/catchAsyncError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowed) => {
    const filtered = {};
    Object.keys(obj).forEach(key => {
        if (allowed.includes(key)) filtered[key] = obj[key];
    })
    return filtered;
}

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: `Error`,
        message: `Resource not available`,
    });
};

exports.postUser = (req, res) => {
    res.status(500).json({
        status: `failed`,
        message: `Method not available`,
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: `Error`,
        message: `Resource not available`,
    });
};

exports.patchUser = (req, res) => {
    res.status(500).json({
        status: `failed`,
        message: `Method not available`,
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: `failed`,
        message: `Method not available`,
    });
};

exports.updateMe = catchAsyncError(async (req, res, next) => {
    if (req.body.password || req.body.passwordConf) {
        return next(new AppError("This router isnt for password update", 400));
    }
    const filteredBody = filterObj(req.body, 'name', 'email');
    const result = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        result
    })
});

exports.deleteMe = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(200).json({
        status: 'success'
    })
})