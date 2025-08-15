const mongoose = require('mongoose')

const dbConnect = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodb connected successfully! ${conn.connection.host}`)
    }
    catch(error){
        console.log('error in db connection', error)
        process.exit(1)
    }
}

module.exports = dbConnect