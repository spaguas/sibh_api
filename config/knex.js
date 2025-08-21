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
    pool: { 
      min: 0, 
      max: parseInt(process.env.DATABASE_MAXPOOL)
    }
    
});

let pgWD = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    database: process.env.WD_DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: false,
  },
  pool: { min: 0, max: parseInt(process.env.DATABASE_MAXPOOL) },
});


module.exports = {
  pg,
  pgWD
}