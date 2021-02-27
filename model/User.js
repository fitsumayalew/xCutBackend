const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: [true, 'A user with user name already exists'],
    },
    password: {
        required: true,
        type: String,
        select: false,
        minlength: [8, 'Password should be at least 8 characters long']
    },
    favorites: {
        // {id: barberShopId, name: barberShopName }
        type: [Object],
        // ref: 'BarberShop',
        default: []
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now()
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
})

module.exports = mongoose.model('User', UserSchema);