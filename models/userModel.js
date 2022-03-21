const mongoose = require(`mongoose`);
const slugify = require(`slugify`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);
const catchAsyncError = require('./../utils/catchAsyncError');
const crypto = require('crypto');
//const isEmail = require('validator/lib/isEmail');

//////////////////////////////Schema////////////////////////////
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, `Name is required`]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid Email']
        // {
        //     validator: function (val) {
        //         validator.isEmail(val);
        //     },
        //     message: `Invalid Email`
        // }
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'lead-guide', 'guide', 'user'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },
    passwordConf: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                return val == this.password
            },
            message: `Passwords not same`
        }
    },
    passwordChangedAt: Date,
    passowrdResetToken: String,
    passwordResetTokenValidity: Date
})

/////////////////MiddleWare///////////////////////////////
userSchema.pre(`save`, async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConf = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidate, password) {
    return await bcrypt.compare(candidate, password);
}

userSchema.methods.passwordChanged = function (JWTTimeStamp) {
    // console.log(JWTTimeStamp)
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt / 1000, 10);
        console.log(changedTimeStamp + ' and ' + JWTTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const token = crypto.randomBytes(256).toString('hex');

    this.passowrdResetToken = crypto.createHash('sha256').update(token).digest('hex');

    this.passwordResetTokenValidity = Date.now() + 10 * 60 * 1000;

    return token;
}

///////////////////////////////////////////////////////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;