const { buildWhere } = require('../modules/stations');
const serializer = require('./serializer');
require('dotenv').config()

let pg = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      ssl: false,
    },
    pool: { min: 0, max: parseInt(process.env.DATABASE_MAXPOOL) },
});



const getStations = async (options = {}) =>{
    
    let serializer_name = validateSerializer(options.serializer) ? options.serializer : 'very_short'
    
    let fields = serializer.station[serializer_name]
    
    let query = pg.table('station_prefixes').select(fields)

    if(['default'].includes(serializer_name)){                    
            query.join('stations', 'stations.id', 'station_prefixes.station_id')
            .join('cities', 'cities.id', 'stations.city_id')
            .join('ugrhis', 'ugrhis.id', 'stations.ugrhi_id')
            .join('subugrhis', 'subugrhis.id', 'stations.subugrhi_id')
            .join('station_types', 'station_types.id', 'station_prefixes.station_type_id')
            .join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')            
    }

    buildWhere(options, query)

    return query
}


const testDBConnection = () =>{
    pg.raw('SELECT 1')
        .then(result =>{
            console.log('Certo', result);
        })
}

const validateSerializer = (string) =>{    
    let available_options = Object.keys(serializer.station)
    return available_options.includes(string)
}


module.exports = {
    testDBConnection,
    getStations
}