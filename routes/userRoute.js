const express = require(`express`);
const userControl = require(`../controllers/userControl`);
const router = express.Router();

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