const express = require('express');
const router = express.Router();

const { promisePool } = require('../database/db.connect')


// get all the booking records
router.get('/booking', (req, res) => {
    res.json('/user/booking route')
})

// get one specific booking records
router.get('/booking/:reservationId', (req, res) => {
    res.json('/user/booking/:reservationId')
})

// delete one specific booking records
router.delete('/booking/:reservationId', (req, res) => {
    res.json('delete /user/booking/:reservationId')
})



module.exports = router
