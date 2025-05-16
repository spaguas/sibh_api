const {getParameters} = require('../config/database')
const express = require('express');
const { getRadarLastImages } = require('../services/s3Service');
const router = express.Router();

router.get('/radar/pnova/last_images', async (req, res) => {  
    res.json(await getRadarLastImages(req.query));
    
});


module.exports = router