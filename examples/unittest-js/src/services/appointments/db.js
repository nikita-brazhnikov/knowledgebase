
function appointmentsTable() {
    // return db client
}

module.exports = {
    query: async (params) => appointmentsTable().query(params),
    put: async (params) => appointmentsTable().putItem(params),
    getOne: async (id) => appointmentsTable().getItem({partitionKey: id}),
}