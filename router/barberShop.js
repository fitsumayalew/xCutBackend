const express = require('express');
const barberController = require('../controllers/barberController');

const router = express.Router();

// only for adding mock data, not used in frontend
router.post('/addBarberShop', barberController.addBarberShop)

router.get('/getAllBarberShops', barberController.getAllBarberShops)

router.get('/searchBarberShop/:searchKey', barberController.searchBarberShop)


module.exports = router;