const adminUsers = require('../../datasources/adminusers')
const connector = require('../../datasources/connector')

class Service {
    constructor(data) {
        this.external_id = data.external_id
        this.service_name = data.service_name
        this.merchant_name = data.merchant_name
        this.merchant_email = data.merchant_email
        this.gateway_account_ids = data.gateway_account_ids
    }

    users() {
        return adminUsers.usersByServiceExternalId(this.external_id)
    }

    async gateway_accounts({apple_pay_enabled, payment_provider}) {
        const gatewayAccounts = await Promise.all(this.gateway_account_ids.map(async (id) => {
            return await connector.getGatewayAccount(id, apple_pay_enabled, payment_provider)
        }))
        return gatewayAccounts.filter(x => x !== null).map(ga => new GatewayAccount(ga))
    }
}

class GatewayAccount {
    constructor(data) {
        this.service_name = data.service_name
        this.payment_provider = data.payment_provider
        this.apple_pay_enabled = data.apple_pay_enabled
    }
}

module.exports = {
    services: async () => {
        try {
            const s = await adminUsers.services()
            return s.map(async (service) => {
                return new Service ({
                    external_id: service.external_id,
                    service_name: service.service_name? service.service_name.en : null,
                    merchant_name: service.merchant_details? service.merchant_details.name : null,
                    merchant_email: service.merchant_details? service.merchant_details.email : null,
                    gateway_account_ids: service.gateway_account_ids
                })
            })
        } catch (err) {
            throw err
        }
    },
    gateway_accounts: async ({apple_pay_enabled, payment_provider}) => {
        if (apple_pay_enabled === undefined && payment_provider === undefined) {
            throw new Error('You must have at least one filter')
        }
        try {
            const gatewayAccounts = await connector.getGatewayAccounts(apple_pay_enabled, payment_provider)
            return gatewayAccounts.map(ga => new GatewayAccount({
                service_name: ga.service_name,
                payment_provider: ga.payment_provider,
                apple_pay_enabled: ga.allow_apple_pay
            }))
        } catch (err) {
            throw err
        }
    }
}