const express = require("express")
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/user.route")
const morgan = require("morgan")
const dbConnect = require('./db/db.conn')
dbConnect()

const rabbitMQ = require("./service/rabbit")
rabbitMQ.connect()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cookieParser())

app.use("/", userRoute)

module.exports = app