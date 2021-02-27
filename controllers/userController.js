const bcrypt = require('bcrypt');
const User = require('../model/User');
const BarberShop = require('../model/BarberShop');
const asyncHandler = require('../middleware/asyncHandler');
var mongoose = require('mongoose');


exports.getProfile = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let names = [];


    let user = await User.findById(id)

    let barberShops = await BarberShop.find({ _id: { $in: user.favorites } }, { name: 1, _id: 0 })
    barberShops.map((barberShop) => { names.push(barberShop.name) })

    if (!user) {
        return res.status(201).json({
            status: true,
            msg: 'User profile not found'
        })
    }

    user.favorites = names;

    return res.status(201).json({
        status: true,
        data: user,
    })
})

// update password
exports.editProfile = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let { oldPassword, password } = req.body

    let user = await User.findById(id).select('+password')

    // @ts-ignore
    const isMatched = await bcrypt.compare(oldPassword, user.password)

    if (!isMatched) {
        return res.status(200).json({
            status: false,
            msg: 'Old password is incorrect'
        })
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.findByIdAndUpdate(id, { password })

    return res.status(201).json({
        status: true,
        data: user,
        msg: 'Password update successful'
    })
})

exports.deleteProfile = asyncHandler(async(req, res, next) => {
    let id = req.user.id

    let user = await User.findById(id)
    if (!user) {
        return res.status(201).json({
            status: true,
            msg: 'User profile not found'
        })
    }

    await User.findByIdAndDelete(id, null, (error, user) => {
        if (error) {
            return res.status(201).json({
                status: false,
                msg: 'Error deleting profile'
            })
        } else {
            return res.status(201).json({
                status: true,
                data: user,
                msg: 'Profile deleted'
            })
        }
    })
})

exports.addFavorite = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let barberShopId = req.params.barberShopId;

    let barberShop = await BarberShop.findById(mongoose.Types.ObjectId(barberShopId))

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: 'BarberShop not found'
        })
    }

    let check = await User.find({ favorites: { $elemMatch: { id: barberShopId } } })

    if (check[0]) {
        return res.status(200).json({
            status: false,
            msg: 'Already added to favorites'
        })
    }

    let user = await User.findById(mongoose.Types.ObjectId(id));


    user = await User.findOneAndUpdate(id, { $push: { favorites: { id: barberShopId, name: barberShop.name } } }, { new: true })

    if (!user) {
        return res.status(200).json({
            status: false,
            msg: 'Error adding to favorite'
        })
    }

    return res.status(201).json({
        status: true,
        data: user,
        msg: 'Added to favorite'
    })
})

exports.setAppointment = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let barberShopId = req.params.barberShopId;

    let barberShop = await BarberShop.findById(barberShopId)

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Barbershop not found`
        })
    }

    // @ts-ignore
    if (barberShop.appointments.includes(id)) {
        return res.status(200).json({
            status: false,
            msg: 'You already have an appointment'
        })
    }

    barberShop = await BarberShop.findOneAndUpdate(barberShopId, { $push: { appointments: id } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error adding appointment`
        })
    }

    return res.status(201).json({
        status: true,
        msg: 'Appointment added'
    })
})

exports.getAppointments = asyncHandler(async(req, res, next) => {
    let id = req.user.id

    let barberShops = await BarberShop.find({ appointments: { $elemMatch: { $eq: mongoose.Types.ObjectId(id) } } }, { name: 1 })
    if (!barberShops) {
        return res.status(200).json({
            status: false,
            msg: `No appointments yet`
        })
    }

    return res.status(200).json({
        status: true,
        data: barberShops,
    })
})

exports.addReview = asyncHandler(async(req, res, next) => {
    const { id, email } = req.user
    const barberShopId = req.params.barberShopId

    let { message, rating } = req.body

    let barberShop = await BarberShop.findByIdAndUpdate(barberShopId, { $push: { review: { user: id, email, review: message, rating } } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error adding review`
        })
    }

    let barberShops = await BarberShop.find()

    return res.status(201).json({
        status: true,
        data: barberShops,
        msg: `Review added successfully`
    })
})

exports.removeFavorite = asyncHandler(async(req, res, next) => {
    const id = req.user.id
    let barberShopId = req.params.barberShopId;


    // let barberShop = await BarberShop.findById(barberShopId)

    // if (!barberShop) {
    //     return res.status(200).json({
    //         status: false,
    //         msg: `Barbershop not found`
    //     })
    // }

    let user = await User.findByIdAndUpdate(id, { $pull: { favorites: barberShopId } })

    if (!user) {
        return res.status(200).json({
            status: false,
            msg: 'Error removing from favorite'
        })
    }

    return res.status(201).json({
        status: true,
        data: user,
        msg: 'Removed from favorite'
    })
})

exports.deleteAppointment = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let barberShopId = req.params.barberShopId;

    let barberShop = await BarberShop.findById(barberShopId)

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Barbershop not found`
        })
    }

    // @ts-ignore
    if (!barberShop.appointments.includes(id)) {
        return res.status(200).json({
            status: false,
            msg: 'You don\'t have an appointment'
        })
    }

    barberShop = await BarberShop.findByIdAndUpdate(barberShopId, { $pull: { appointments: id } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error deleting appointment`
        })
    }

    return res.status(201).json({
        status: true,
        msg: 'Appointment deleted'
    })
})

exports.deleteReview = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let barberShopId = req.params.barberShopId;
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');
    console.log('from delete');

    // @ts-ignore
    let barberShop = await BarberShop.findByIdAndUpdate(barberShopId, { $pull: { review: { user: id }, rating: { user: id } } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error deleting review`
        })
    }

    let barberShops = await BarberShop.find()[0]
    console.log('from delete', barberShop);

    return res.status(201).json({
        status: true,
        data: barberShops,
        msg: 'Review deleted'
    })

})

exports.addRating = asyncHandler(async(req, res, next) => {
    const { id, email } = req.user
    const barberShopId = req.params.barberShopId

    let { rating } = req.body

    console.log(id, barberShopId, rating)

    let barberShop = await BarberShop.findByIdAndUpdate(barberShopId, { $push: { rating: { user: id, email, rating } } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error adding rating`
        })
    }

    return res.status(201).json({
        status: true,
        msg: `Rating added successfully`
    })
})

exports.deleteRating = asyncHandler(async(req, res, next) => {
    let id = req.user.id
    let barberShopId = req.params.barberShopId;

    // @ts-ignore
    let barberShop = await BarberShop.findByIdAndUpdate(barberShopId, { $pull: { rating: { user: id } } })

    if (!barberShop) {
        return res.status(200).json({
            status: false,
            msg: `Error deleting rating`
        })
    }

    return res.status(201).json({
        status: true,
        msg: 'Rating deleted'
    })

})