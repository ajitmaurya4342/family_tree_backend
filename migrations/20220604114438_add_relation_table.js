exports.up = async function (knex) {
    await knex.schema.createTable("user_relation", (table) => {
        table.increments("relation_id").primary();
        table.integer("user_id")
        table.integer("parent_id")
        table.enu('relation_is_active', ['Y', 'N']).defaultTo('Y');
        table.integer("created_by").defaultTo();
        table.datetime("created_at").defaultTo();
        table.integer("updated_by").defaultTo();
        table.datetime("updated_at").defaultTo();    
    });

};


exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("user_relation");
};
