const adminUsers = require('../../datasources/adminusers')

module.exports = {
    services: async () => {
        try {
            const s = await adminUsers.services()
            return s.map(async (service) => {
                return {
                    external_id: service.external_id,
                    service_name: service.service_name? service.service_name.en : null,
                    merchant_name: service.merchant_details? service.merchant_details.name : null,
                    merchant_email: service.merchant_details? service.merchant_details.email : null,
                    users: await adminUsers.usersByServiceExternalId(service.external_id)
                }
            })
        } catch (err) {
            throw err;
        }
    }
}