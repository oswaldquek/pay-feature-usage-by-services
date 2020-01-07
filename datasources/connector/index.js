const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "connector",
  port: 5432,
  host: "localhost",
  ssl: true
})

const gatewayAccounts = async function gatewayAccounts(gatewayAccountIds) {
  if (gatewayAccountIds.length == 0) {
    return []
  }
  return gatewayAccountIds.map(async (id) => {
    if (id.includes('DIRECT_DEBIT')) {
      return {
        service_name: null,
        payment_provider: 'gocardless'
      }
    } else {
      var res = await pool.query('select payment_provider, service_name from gateway_accounts where id = $1', [id])
      return {
        service_name: res.rows[0].service_name,
        payment_provider: res.rows[0].payment_provider
      }
    }
  })
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  gatewayAccounts
}