const mongoose = require(`mongoose`);
const slugify = require(`slugify`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);
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
    password: {
        type: String,
        required: true,
        minLength: 8
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
    }
})

/////////////////MiddleWare///////////////////////////////
userSchema.pre(`save`, async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConf = undefined;
    next();
});


///////////////////////////////////////////////////////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;