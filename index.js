const { createRoutes: createParamRoutes} = require('./routes/parameterRoutes')
require('dotenv').config()
const port = process.env.HTTP_PORT

const app = require('./app')

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

createParamRoutes(app)