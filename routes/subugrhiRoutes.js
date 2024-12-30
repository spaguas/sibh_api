const { getParameters } = require('../config/database');
const {getSubugrhis} = require('../config/database/subugrhi_db')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {  
    let subugrhis = await getSubugrhis(req.query)

    let parameters

    if(Array.isArray(req.query.parameter_type_ids) && req.query.parameter_type_ids.length > 0){
        parameters = await getParameters({parameterizable_type: 'Subugrhi', parameter_type_ids: req.query.parameter_type_ids})
    }

    // res.send({
    //     subugrhis: subugrhis, 
    //     ...(parameters ? {parameters:parameters} : {}) //só se for solicitado
    // })
    res.send(subugrhis)
});

module.exports = router