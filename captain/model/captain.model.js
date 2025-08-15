const mongoose = require('mongoose')

const captainSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'captain name is required!']
    },

    email:{
        type: String,
        required: [true, 'captain email is required!'],
        unique: true,
    },

    password:{
        type: String,
        required: [true, 'captain password is required!'],
        select: false,
    },

    isAvailable:{
        type: Boolean,
        default: false
    },
}, {timestamps: true})

module.exports = mongoose.model('captain', captainSchema)