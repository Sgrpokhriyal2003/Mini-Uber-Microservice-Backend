const mongoose = require("mongoose")

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`captain service db connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log('error in connecting captain db', error)
        process.exit(1)
    }
}

module.exports = connectDB