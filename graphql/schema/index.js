const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Service {
   external_id: String!
   service_name: String
   merchant_name: String
   merchant_email: String
   users: [User]
   gateway_accounts: [GatewayAccount]
}

type User {
   email: String
}

type GatewayAccount {
   payment_provider: String!
   service_name: String
}

type Query {
   services: [Service!]
}
`);