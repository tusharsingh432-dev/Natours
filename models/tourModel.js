const mongoose = require(`mongoose`);
const slugify = require(`slugify`);
const validator = require(`validator`);
//////////////////Schema////////////////////////
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [40, `Too Long...`],
        minlength: [10, `Too Short...`],
    },
    slug: String,
    secret: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: [`easy`, `medium`, `difficult`],
            message: `Error In Difficulty.......`
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, `Rating is supposed to be b/w 1&5`],
        max: [5, `Rating is supposed to be b/w 1&5`]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: `Discount less than price`
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


///////////////////////virtual Variables//////////////////////////////////////
tourSchema.virtual(`durarionWeeks`).get(function () {
    return this.duration / 7;
})


//////////////////////////////Document MiddleWare/////////////////////////
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    //console.log(`Pre Worked..`);
    console.log(`Slug: ${this.slug}`);
    next();
})

// tourSchema.post(`save`, function (doc, next) {
//     console.log(doc);
//     console.log(`Post Worked..`);
//     next();
// })



/////////////////////////////Query MiddleWare////////////////////////////////////
tourSchema.pre(/^find/, function (next) {
    this.find({ secret: { $ne: true } });
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Accurate Time: ${Date.now() - this.start}`);
    next();
})
///////////////////////////////Aggeregation MiddleWare///////////////////
tourSchema.pre('aggregate', function (next) {

    this.pipeline().unshift({ $match: { secret: { $ne: true } } });
    console.log(this.pipeline());
    next();
})

//////////////////////////////////////////////////////////////////
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;