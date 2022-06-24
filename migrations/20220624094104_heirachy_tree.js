exports.up = async function (knex) {
    await knex.schema.alterTable("users", function (table) {
        table.integer("order_child").defaultTo(0);
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("users", function (table) {
        table.dropColumn("order_child");
    });
};
