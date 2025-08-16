const express = require('express')
const captainController = require("../controller/captain.controller")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/register", captainController.register)
router.post("/login", captainController.login)
router.get("/profile", authMiddleware.captainAuth, captainController.profile)
router.get("/logout", captainController.logout)
router.patch("/toggle-availability", authMiddleware.captainAuth, captainController.toggleAvailability)
router.get("/new-ride", authMiddleware.captainAuth, captainController.waitForRide)

module.exports = router