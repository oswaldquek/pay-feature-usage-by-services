const adminUsers = require('../../datasources/adminusers')
const connector = require('../../datasources/connector')

module.exports = {
    services: async ({apple_pay_enabled}) => {
        try {
            const s = await adminUsers.services()
            const services = await Promise.all(s.map(async (service) => {
                return {
                    external_id: service.external_id,
                    service_name: service.service_name? service.service_name.en : null,
                    merchant_name: service.merchant_details? service.merchant_details.name : null,
                    merchant_email: service.merchant_details? service.merchant_details.email : null,
                    users: await adminUsers.usersByServiceExternalId(service.external_id),
                    gateway_accounts: await connector.gatewayAccounts(service.gateway_account_ids, apple_pay_enabled)
                }
            }))
            return services.filter(s => {
                if (apple_pay_enabled !== undefined) {
                    return s.gateway_accounts.filter(ga => ga.apple_pay_enabled === apple_pay_enabled).length > 0
                }
                return true
            })
        } catch (err) {
            throw err;
        }
    }
}