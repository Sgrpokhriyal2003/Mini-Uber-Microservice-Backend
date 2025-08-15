const captainModel = require('../model/captain.model')
const blackListModel = require("../model/blacklisttokenmodel.model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports.register = async(req, res) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                error: 'all fields are required!'
            })
        }

        const captain = await captainModel.findOne({ email })
        if(captain){
            return res.status(400).json({
                error: 'captain already exists'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newCaptain = await captainModel.create({
            name, 
            email,
            password: hashPassword
        })

        await newCaptain.save()
        const token = jwt.sign({id: newCaptain._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.cookie("token", token)

        delete newCaptain._doc.password
        res.status(201).json({
            token,
            newCaptain
        })
    }
    catch(error){
        console.log('error in captain register controller', error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports.login = async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                error: 'email and password are required!'
            })
        }

        const captain = await captainModel.findOne({ email }).select('+password')
        if(!captain){
            return res.status(404).json({
                error: 'invalid email or password'
            })
        }

        const isMatch = await bcrypt.compare(password, captain.password)
        if(!isMatch){
            return res.status(400).json({
                error: 'invalid email or password'
            })
        }

        const token = jwt.sign({id: captain._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        delete captain._doc.password

        res.cookie("token", token)

        res.status(200).json({
            token,
            captain
        })
    }
    catch(error){
        console.log('error in captain login controller', error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports.logout = async(req, res) => {
    try{
        const token = req.cookies.token
        await blackListModel.create({ token })
        res.clearCookie('token')
        res.status(200).json({
            message: 'captain logged out successfully!'
        })
    }
    catch(error){
        console.log('error in captain logout controller', error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports.profile = async(req, res) => {
    try{
        // delete req.captain._doc.password;
        res.status(200).json(req.captain)
    }
    catch(error){
        console.log('error in captain profile controller', error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports.toggleAvailability = async(req, res) => {
    try{
        const captain = await captainModel.findById(req.captain._id)
        captain.isAvailable = !captain.isAvailable
        await captain.save()
        res.status(200).json(captain)
    }
    catch(error){
        console.log('error in captain toggleAvailability controller', error)
        res.status(500).json({
            message: error.message
        })
    }
}