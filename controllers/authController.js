const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/User')
const asyncHandler = require('../middleware/asyncHandler');

exports.signup = asyncHandler(async(req, res, next) => {
    let { email, password } = req.body;

    let user = await User.findOne({ email })
    if (user) {
        return res.status(200).json({
            status: false,
            msg: `User with email ${email} already exists`
        })
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ email, password })
    if (!user) {
        return res.status(200).json({
            status: false,
            msg: 'Error creating user'
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

    return res.status(201).json({
        status: true,
        data: user,
        jwt: token
    })
})

exports.login = asyncHandler(async(req, res, next) => {
    let { email, password } = req.body;

    let user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(200).json({
            status: false,
            msg: 'User not found'
        })
    }

    // @ts-ignore
    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) {
        return res.status(200).json({
            status: false,
            msg: 'Password incorrect'
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

    return res.status(200).json({
        status: true,
        data: user,
        jwt: token
    })

})