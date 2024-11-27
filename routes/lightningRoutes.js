
const express = require('express');
const { getLightnings } = require('../config/database/lightning_db');
const router = express.Router();


router.get('/last_lightnings', async (req, res) => {  
    let response = await getLightnings()
    res.send(response);
});

module.exports = router