const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const captainRoute = require("./route/captain.route")
const connectDB = require('./db/db')
connectDB()

const rabbitMQ = require("./service/rabbit")
rabbitMQ.connect()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))

app.use("/", captainRoute)

module.exports = app