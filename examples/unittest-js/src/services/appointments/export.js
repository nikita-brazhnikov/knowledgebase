const db = require('./db');

class AppointmentsExporter {
    constructor(departmentId) {
    }
    setColumnNamesMapping(propertyToTitle) {
        this.mapping = propertyToTitle;
    }
    // ...
    setDatabaseGateway(db) {
        this.db = db;
    }


    async run() {
        //...
        this.db.query({ /* */ })
        //..
        this.db.getItem( { /* */ })
    }
}


module.exports = {
    prepareAndExport: async () => {},

    createExporter: (id) => {
        const exporter = new AppointmentsExporter(id);
        exporter.setDatabaseGateway({
            query: db.query,
            getItem: async (id) => db.getOne(id),
        })
        return exporter;
    }
}