const rideModel = require("../model/ride.model")
const {subscribeToQueue, publishToQueue} = require('../service/rabbit')

module.exports.createRide = async(req, res, next) => {
    try{
        const {pickup, destination} = req.body
        if(!pickup || !destination){
            return res.status(400).json({error: 'all fields are required!'})
        }

        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        })

        await newRide.save()
        publishToQueue('new-ride', JSON.stringify(newRide))
        res.status(200).json(newRide)
    }
    catch(error){
        console.log('error in createRide controller')
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.acceptRide = async(req, res, next) => {
    try{
       const {rideId} = req.query
       const ride = await rideModel.findById(rideId)
       if(!ride){
         return res.status(404).json({error: "ride not found!"})
       }

       ride.status = 'accepted'
       publishToQueue('ride-accepted', JSON.stringify(ride))
       await ride.save()
       res.status(200).json(ride)

    
    }
    catch(error){
        console.log('error in acceptRide controller', error)
        res.status(500).json({
            error: error.message
        })
    }
}