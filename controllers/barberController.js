const BarberShop = require('../model/BarberShop');
const asyncHandler = require('../middleware/asyncHandler');

exports.addBarberShop = asyncHandler(async(req, res, next) => {

    let barberShop = await BarberShop.findOne({ name: req.body.name })

    if (barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Barbershop with the name ${req.body.name} already exists`
        })
    }

    barberShop = await BarberShop.create(req.body)

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: 'Barbershop not created'
        })
    }

    return res.status(201).json({
        status: true,
        data: barberShop
    })
})

exports.searchBarberShop = asyncHandler(async(req, res, next) => {
    let searchKey = req.params.searchKey

    let barberShop = await BarberShop.find({
        $or: [
            { name: { "$regex": searchKey, "$options": "i" } },
            { address: { "$regex": searchKey, "$options": "i" } }
        ]
    })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: 'No result found'
        })
    }

    return res.status(200).json({
        status: true,
        data: barberShop
    })
})

exports.getAllBarberShops = asyncHandler(async(req, res, next) => {

    let barberShops = await BarberShop.find()
    console.log(barberShops)

    if (!barberShops) {
        return res.status(200).json({
            status: false,
            msg: 'No BarberShops found'
        })
    }

    return res.status(200).json({
        status: true,
        data: barberShops
    })
})