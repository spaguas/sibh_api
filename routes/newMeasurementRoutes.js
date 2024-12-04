
const express = require('express');
const { getMeasurements } = require('../config/database/new_measurements');
const router = express.Router();

router.get('/', async (req, res) => {  
    res.send(await getMeasurements(req.query));
});

module.exports = router