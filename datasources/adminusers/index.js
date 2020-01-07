const axios = require('axios');
const https = require('https')

const client = axios.create({
    baseURL: 'https://localhost:9001/v1/api/services/',
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true
      })
  });

const services = () => client.get('list').then((response) => response.data)

const usersByServiceExternalId = async function usersByServiceExternalId(serviceExternalId) {
    const users = await client.get(`${serviceExternalId}/users`).then((response) => response.data)
    return users.map(user => {
        return {
            email: user.email
        }
    })
}

module.exports = {
    services,
    usersByServiceExternalId
}