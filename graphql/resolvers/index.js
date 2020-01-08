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

    gateway_accounts({apple_pay_enabled}) {
        return connector.gatewayAccounts(this.gateway_account_ids, apple_pay_enabled)
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
            throw err;
        }
    }
}