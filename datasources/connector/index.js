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
        payment_provider: 'gocardless',
        apple_pay_enabled: false,
        uses_metadata: false
      }
    } else {
      var res = await pool.query('select payment_provider, service_name, allow_apple_pay from gateway_accounts where id = $1', [id])
      return {
        service_name: res.rows[0].service_name,
        payment_provider: res.rows[0].payment_provider,
        apple_pay_enabled: res.rows[0].allow_apple_pay,
        uses_metadata: await usesMetadata(id)
      }
    }
  })
}

const usesMetadata = async function usesMetadata(gatewayAccountId) {
  var res = await pool.query('select external_metadata from charges where gateway_account_id = $1 and external_metadata is not null limit 1', [gatewayAccountId])
  if (res.rows.length == 0 ) {
    return false
  } else {
    return true
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  gatewayAccounts
}