const express = require(`express`);
const tourControl = require(`../controllers/tourControl`)
const authControl = require(`../controllers/authControl`)
const router = express.Router();

// router.param(`id`, tourControl.validateID);

router.route(`/get-stats`).get(tourControl.getTourStats);
router.route(`/get-monthly-stats`).get(tourControl.getMonthlyStats);

router
    .route(`/`)
    .get(authControl.protect, tourControl.getAllTours)
    .post(tourControl.postTour);

router
    .route(`/:id`)
    .get(tourControl.getTourByID)
    .patch(tourControl.patchTour)
    .delete(authControl.protect, authControl.restrictTo('admin', 'lead-guide'), tourControl.deleteTour);

module.exports = router;