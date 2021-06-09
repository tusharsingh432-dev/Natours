const express = require(`express`);
const tourControl = require(`../controllers/tourControl`)

const router = express.Router();

// router.param(`id`, tourControl.validateID);

router.route(`/get-stats`).get(tourControl.getTourStats);
router.route(`/get-monthly-stats`).get(tourControl.getMonthlyStats);

router
    .route(`/`)
    .get(tourControl.getAllTours)
    .post(tourControl.postTour);

router
    .route(`/:id`)
    .get(tourControl.getTourByID)
    .patch(tourControl.patchTour)
    .delete(tourControl.deleteTour);

module.exports = router;