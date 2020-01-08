const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "connector",
  port: 5432,
  host: "localhost",
  ssl: true
})

const gatewayAccounts = async function gatewayAccounts(gatewayAccountIds, applePayEnabled) {
  const gatewayAccounts = await Promise.all(gatewayAccountIds.map(async (id) => {
    if (id.includes('DIRECT_DEBIT')) {
      if (applePayEnabled === true) {
        return null
      }
      return {
        service_name: null,
        payment_provider: 'gocardless',
        apple_pay_enabled: false
      }
    } else {
      let query = 'select payment_provider, service_name, allow_apple_pay from gateway_accounts where id = $1'
      let values = [id]
      if (applePayEnabled !== undefined) {
        query = query + ' and allow_apple_pay = $2'
        values.push(applePayEnabled)
      }

      var res = await pool.query(query, values)

      if (res.rows[0] === undefined) {
        return null
      }
      return {
        service_name: res.rows[0].service_name,
        payment_provider: res.rows[0].payment_provider,
        apple_pay_enabled: res.rows[0].allow_apple_pay
      }

    }
  }))
  return gatewayAccounts.filter(x => x !== null)
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  gatewayAccounts
}