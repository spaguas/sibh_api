const {getUgrhis} = require('../config/database/ugrhi_db')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {  
    res.send(await getUgrhis(req.query));
});

module.exports = router