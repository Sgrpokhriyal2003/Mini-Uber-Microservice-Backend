const express = require("express")
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/user.route")
const morgan = require("morgan")
const dbConnect = require('./db/db.conn')

const app = express()
dbConnect()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cookieParser())

app.use("/user", userRoute)

module.exports = app