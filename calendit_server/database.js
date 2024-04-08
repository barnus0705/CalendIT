const {Client} = require('pg')
var PgClient = class extends Client{
    constructor() {
        super(
            {
                host: "localhost",
                user: "postgres",
                password: "0705",
                port: 5432,
                database: "postgres"
            }
        );
    }
}

module.exports = PgClient

