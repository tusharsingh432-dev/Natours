const express = require(`express`);
const userControl = require(`../controllers/userControl`);
const router = express.Router();
const authControl = require(`./../controllers/authControl`);


router.route(`/signup`).post(authControl.signup);
router.route(`/login`).post(authControl.login);
router.route('/forgotpassword').post(authControl.forgotPassword);
router.route('/resetpassword/:token').post(authControl.resetPassword);

router
    .route(`/`)
    .get(userControl.getAllUsers)
    .post(userControl.postUser);

router
    .route(`/:id`)
    .get(userControl.getUser)
    .patch(userControl.patchUser)
    .delete(userControl.deleteUser);

module.exports = router;