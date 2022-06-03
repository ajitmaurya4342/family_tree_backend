// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: "",
      database: "",
      password: "",
      user: "",
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

 

};
