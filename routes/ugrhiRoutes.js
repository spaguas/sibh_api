const { getParameters } = require('../config/database');
const {getUgrhis} = require('../config/database/ugrhi_db')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    let ugrhis = await getUgrhis(req.query)

    let parameters

    if(Array.isArray(req.query.parameter_type_ids) && req.query.parameter_type_ids.length > 0){
        parameters = await getParameters({parameterizable_type: 'Ugrhi', parameter_type_ids: req.query.parameter_type_ids})
    }

    // res.send({
    //     ugrhis: ugrhis, 
    //     ...(parameters ? {parameters:parameters} : {}) //só se for solicitado
    // })
    res.send(ugrhis)
});

module.exports = router