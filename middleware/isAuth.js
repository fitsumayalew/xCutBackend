const jwt = require('jsonwebtoken');
const User = require('../model/User');
const asyncHandler = require('../middleware/asyncHandler');

const isAuth = async(req, res, next) => {
    if ((req.headers.authorization) && (req.headers.authorization.startsWith('Bearer'))) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const userId = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // @ts-ignore
            const user = await User.findById(userId.id);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    msg: 'Authorization Failed'
                })
            }

            req.user = user;
            return next();
        } catch (error) {
            return res.status(200).json({
                status: false,
                msg: 'Error Verifying user'
            })
        }
    }
    return res.status(200).json({
        status: true,
        msg: 'Authorization Failed'
    })
}

module.exports = isAuth;