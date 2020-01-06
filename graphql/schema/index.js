const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Service {
   external_id: String!
   service_name: String
   merchant_name: String
   merchant_email: String
   users: [User]
}

type User {
   email: String
}

type Query {
   services: [Service!]
}
`);