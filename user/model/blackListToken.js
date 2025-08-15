const mongoose = require('mongoose')

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // 1 hour
    }
}, {timestamps: true})

module.exports = mongoose.model("blacklisttoken", blackListTokenSchema)
