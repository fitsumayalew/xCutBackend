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
        type: [String],
        ref: 'BarberShop',
        default: []
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema);