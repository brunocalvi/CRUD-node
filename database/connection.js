const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'crud-node',
  },
});

module.exports = knex;
