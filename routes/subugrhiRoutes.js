const {getSubugrhis} = require('../config/database/subugrhi_db')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {  
    res.send(await getSubugrhis(req.query));
});

module.exports = router