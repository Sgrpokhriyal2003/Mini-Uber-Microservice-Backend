const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`ride service db connected successfully! ${conn.connection.host}`)
    }
    catch(error){
        console.log('error in connecting to ride db', error)
        process.exit(1)
    }
}

module.exports = connectDB