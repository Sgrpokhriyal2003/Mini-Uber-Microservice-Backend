const jwt = require('jsonwebtoken')
const User = require("../model/user.model")
const blacklisttokenModel = require("../model/blackListToken")

module.exports.userAuth = async(req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({
                error: 'Unauthorized!'
            })
        }

        const isBlackListed = await blacklisttokenModel.find({token})
        if(isBlackListed.length){
            return res.status(401).json({
                error: "Unauthorized!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                error: "Unauthorized!"
            })
        }

        req.user = user;
        next()
    }
    catch(error){
        res.status(400).json({
            error: "Invalid token!"
        })
    }
}