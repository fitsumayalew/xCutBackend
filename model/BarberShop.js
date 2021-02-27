const mongoose = require('mongoose');

const BarberShopSchema = new mongoose.Schema({
    name: {
        required: true,
        unique: [true, 'Barbershop with this name is present'],
        type: String
    },
    address: {
        required: true,
        type: String
    },
    image: {
        required: true,
        type: String
    },
    // rating: {
    //     // {user: mongoose.Schema.Types.ObjectId, rating: smthing}
    //     type: [Object],
    //     default: []
    // },
    appointments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    location: {
        required: true,
        // {longitude: smtng, latitude: smting }
        type: Object
    },
    review: {
        // {user: mongoose.Schema.Types.ObjectId, review: smthing}
        type: [Object],
        default: []
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('BarberShop', BarberShopSchema);