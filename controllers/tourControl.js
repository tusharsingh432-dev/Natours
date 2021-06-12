const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsyncError = require(`${__dirname}/../utils/catchAsyncError`);
const AppError = require(`${__dirname}/../utils/appErrors`);

exports.getTourByID = catchAsyncError(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError(`No tour of the id ${req.params.id} is found`, 404));
    }
    res.status(200).json({
        status: 'Success',
        tour
    });
});

exports.postTour = catchAsyncError(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
        status: 'Success',
        data: {
            tour: newTour
        }
    });
});

exports.getAllTours = catchAsyncError(async (req, res, next) => {

    const feature = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const tours = await feature.query;
    res.status(200).json({
        status: `success`,
        results: tours.length,
        tours,
    });
});

exports.patchTour = catchAsyncError(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) {
        return next(new AppError(`No tour of the id ${req.params.id} is found`, 404));
    }
    res.status(200).json({
        status: `success`,
        data: {
            tour
        }
    })
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError(`No tour of the id ${req.params.id} is found`, 404));
    }
    res.status(204).json({
        status: `success`,
        data: null
    })
});

exports.getTourStats = async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: `$difficulty`,
                numTours: { $sum: 1 },
                numRating: { $sum: `$ratingsQuantity` },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                maxPrice: { $max: '$price' },
                minPrice: { $min: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ])
    res.status(200).json({
        status: `success`,
        stats
    })
}

exports.getMonthlyStats = async (req, res) => {
    try {
        //console.log(`Debug...`);
        const year = req.query.year;
        console.log(year);
        //console.log(`Debug...`);
        const plan = await Tour.aggregate([
            {
                $unwind: `$startDates`
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTours: { $sum: 1 },
                    tours: { $push: `$name` }
                }
            },
            {
                $addFields: {
                    month: `$_id`
                }
            },
            {
                $project: {
                    _$id: 0
                }
            },
            {
                $sort: { numTours: -1 }
            },
            {
                $limit: 12
            }
        ]);
        //console.log(`Debug....`);
        res.status(200).json({
            status: `success`,
            numTours: plan.length,
            plan
        })

    } catch (e) {
        res.status(404).json({
            status: `failed`,
            e
        })
    }
}