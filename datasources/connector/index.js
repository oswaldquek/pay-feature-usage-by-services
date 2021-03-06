const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "connector",
  port: 5432,
  host: "localhost",
  ssl: true
})

const SQL = require('sql-template-strings')

const getGatewayAccount = async function getGatewayAccount(gatewayAccountId, applePayEnabled, paymentProvider) {
  if (gatewayAccountId.includes('DIRECT_DEBIT')) {
    if (applePayEnabled === true || paymentProvider !== 'gocardless') {
      return null
    }
    return {
      service_name: null,
      payment_provider: 'gocardless',
      apple_pay_enabled: false
    }
  } else {
    const query = SQL`select id, payment_provider, service_name, allow_apple_pay from gateway_accounts where id = ${gatewayAccountId}`
    if (applePayEnabled !== undefined) {
      query.append(SQL` and allow_apple_pay = ${applePayEnabled}`)
    }
    if (paymentProvider !== undefined) {
      query.append(SQL` and payment_provider = ${paymentProvider}`)
    }

    var res = await pool.query(query)

    if (res.rows[0] === undefined) {
      return null
    }
    return {
      service_name: res.rows[0].service_name,
      payment_provider: res.rows[0].payment_provider,
      apple_pay_enabled: res.rows[0].allow_apple_pay,
      gateway_account_id: res.rows[0].id
    }
  }
}

const getGatewayAccounts = async function getGatewayAccounts(applePayEnabled, paymentProvider) {
  const query = SQL`select id, payment_provider, service_name, allow_apple_pay from gateway_accounts where `
  let queryParams = []
  if (applePayEnabled !== undefined) {
    queryParams.push(SQL`allow_apple_pay = ${applePayEnabled}`)
  }
  if (paymentProvider !== undefined) {
    queryParams.push(SQL`payment_provider = ${paymentProvider}`)
  }
  query.append(queryParams[0])
  queryParams.shift()
  queryParams.forEach(q => query.append(SQL` and `).append(q))
  
  var res = await pool.query(query)

  if (res.rows.length == 0) {
    return []
  }
  return res.rows
}

module.exports = {
  getGatewayAccount,
  getGatewayAccounts
}