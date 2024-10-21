const {newParameters} = require('../config/database')

const createRoutes = (app) =>{
    app.get('/parameters', async (req, res) => {  
        res.send({teste: 'Diego'});
    });

    app.post('/parameters', async (req, res) => {  
        let response = await newParameters(req.query)
        res.send(response);
    });
}

module.exports = {
    createRoutes
}