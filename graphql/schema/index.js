const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Service {
   external_id: String!
   service_name: String
   merchant_name: String
   merchant_email: String
   users: [User]
   gateway_accounts(apple_pay_enabled: Boolean, payment_provider: PaymentProvider): [GatewayAccount]
}

enum PaymentProvider {
   gocardless
   worldpay
   epdq
   smartpay
   stripe
   sandbox
}

type User {
   email: String
}

type GatewayAccount {
   payment_provider: String!
   service_name: String
   apple_pay_enabled: Boolean!
   service: Service!
}

type Query {
   services: [Service!]
   gateway_accounts(apple_pay_enabled: Boolean, payment_provider: PaymentProvider): [GatewayAccount]
}
`);