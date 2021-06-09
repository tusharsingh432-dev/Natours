const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);

exports.getTourByID = async (req, res) => {
    try {

        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'Success',
            tour
        });

    } catch (e) {
        res.status(404).json({
            status: `failed`,
            e
        })
    }
};

exports.postTour = async (req, res) => {
    try {

        const newTour = await Tour.create(req.body);

        res.status(200).json({
            status: 'Success',
            data: {
                tour: newTour
            }
        });

    } catch (e) {
        res.status(404).json({
            status: `failed`,
            e
        })
    }
};

exports.getAllTours = async (req, res) => {

    try {
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
    }
    catch (e) {
        res.status(404).json({
            status: `failed`,
        })
        console.log(e);
    }
};

exports.patchTour = async (req, res) => {
    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: `success`,
            data: {
                tour
            }
        })

    } catch (e) {
        res.status(404).json({
            status: `failed`,
            e
        })
    }
};

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: `success`,
            data: null
        })

    } catch (e) {
        res.status(404).json({
            status: `failed`,
            e
        })
    }

};

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