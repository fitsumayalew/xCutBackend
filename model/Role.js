const mongoose = require('mongoose');



const RoleSchema = new mongoose.Schema({
    role: {
        required: true,
        type: String,
        unique: [true, 'A role with user name already exists'],
    },
})

module.exports = mongoose.model('Role', RoleSchema);