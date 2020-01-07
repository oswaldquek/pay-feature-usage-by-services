const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: "connector",
    port: 5432,
    host: "localhost",
    ssl: true
  })

module.exports = {
  query: (text, params) => pool.query(text, params),
}