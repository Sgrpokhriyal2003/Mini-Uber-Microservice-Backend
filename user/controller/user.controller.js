const User = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const blacklisttokenModel = require("../model/blackListToken")
const { subscribeToQueue } = require("../../ride/service/rabbit")
const EventEmitter = require("events")
const rideEventEmitter = new EventEmitter()

module.exports.register = async(req, res) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                error: 'all fields are required!'
            })
        }

        const userExist = await User.findOne({ email })
        if(userExist){
            return res.status(400).json({
                error: 'user already exists with this email!'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.cookie('token', token)
        
        delete newUser._doc.password;
        res.status(201).json({
            message: 'user registered successfully!',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        })
    }
    catch(error){
        console.log('error in register controller', error)
        res.status(500).json({
            errorMessage: 'server side error!',
            error: error.message

        })
    }
}

module.exports.login = async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                error: 'email or password is required!'     
            })
        }

        const user = await User.findOne({ email }).select('+password')
        if(!user){
            return res.status(400).json({
                error:'invalid email or password'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                error: "invalid email or password"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        
        delete user._doc.password;
        res.cookie('token', token)
        res.status(200).json({
            message: 'loggedIn Successfull',
            accessToken: token,
            user
        })
    }
    catch(error){
        console.log('error in login controller', error)
        res.status(500).json({
            message: 'server side error',
            error: error.message
        })
    }
}

module.exports.logout = async(req, res) => {
    try{
        const token = req.cookies.token
        await blacklisttokenModel.create({ token })
        res.clearCookie('token')
        res.status(200).json({message: 'user logged out successfully!'})
    }
    catch(error){
        console.log('error in logout controller', error)
        res.status(500).json({
            message: 'server side error',
            error: error.message
        })
    }
}

module.exports.profile = async(req, res) => {
    try{
        delete req.user._doc.password;
        res.status(200).json(req.user)
    }
    catch(error){
        console.log('error in profile controller', error)
        res.status(500).json({
            message: 'server side error',
            error: error.message  
        })
    }
}

module.exports.acceptedRide = async(req, res) => {
    //long polling: wait for ride-accepted event
    rideEventEmitter.once("ride-accepted", (data) => {
        res.send(data)
    })

    //set timeout for long polling
    setTimeout(() => {
        res.status(204).send();
    }, 30000)
}

subscribeToQueue('ride-accepted', async(msg) => {
    const data = JSON.parse(msg)
    rideEventEmitter.emit("ride-accepted", data)
})