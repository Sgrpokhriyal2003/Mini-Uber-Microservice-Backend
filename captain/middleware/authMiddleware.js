const jwt = require('jsonwebtoken')
const captainModel = require('../model/captain.model')
const blackListTokenModel = require("../model/blacklisttokenmodel.model")

module.exports.captainAuth = async(req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({
                error: 'Unauthorized!'
            })
        }

        const isBlackListed = await blackListTokenModel.find({token})
        if(isBlackListed.length){
            return res.status(401).json({error: 'Unauthorized!'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const captain = await captainModel.findById(decoded.id)
        if(!captain){
            return res.status(401).json({
                error: "Unauthorized!"
            })
        }

        req.captain = captain
        next()
    }
    catch(error){
        res.status(500).json({
            error: "invalid token",
            errorMessage: error.message
        })
    }
}