const express = require('express');
const userController = require('../controllers/userController');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/getProfile', isAuth, userController.getProfile)

router.put('/editProfile', isAuth, userController.editProfile)

router.delete('/deleteProfile', isAuth, userController.deleteProfile)

router.post('/addFavorite/:barberShopId', isAuth, userController.addFavorite)

router.post('/setAppointment/:barberShopId', isAuth, userController.setAppointment)

router.post('/addReview/:barberShopId', isAuth, userController.addReview)

// merged with review
// router.post('/addRating/:barberShopId', isAuth, userController.addRating)

router.get('/getAppointments', isAuth, userController.getAppointments)

router.delete('/removeFavorite/:barberShopId', isAuth, userController.removeFavorite)

router.delete('/deleteAppointment/:barberShopId', isAuth, userController.deleteAppointment)

router.delete('/deleteReview/:barberShopId', isAuth, userController.deleteReview)

// merged with review
// router.delete('/deleteRating/:barberShopId', isAuth, userController.deleteRating)

module.exports = router;