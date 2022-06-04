
exports.up = async function(knex) {
    await knex.schema.createTable("heirachy_table", (table) => {
        table.increments("heirachy_id").primary();
        table.string("heirachy_name")
        table.string("heirachy_description")
        table.string("other_keys")
        table.text("InitialUser")
    });
  
    await knex("heirachy_table").insert([{
        heirachy_name:"Maurya family",
        InitialUser:JSON.stringify([
            {
               email:"admin@123",
               password:"admin@123",
               first_name:"Admin",
               last_name:"",
               user_level:0,
               is_admin:"Y"
               
            },
            {
               first_name:"Ajit",
               last_name:"Maurya",
               email:"ajitmaurya3216@gmail.com",
               user_level:1,
               is_admin:"Y",
               is_married:"Y",
               gender:"Male",
               wife_id:3,
               user_is_active:"Y",
               is_admin:"N"
               
             },
             {
                first_name:"Mrs.",
                last_name:"Maurya",
                email:"ajitmaurya3216@gmail.com",
                is_admin:"Y",
                is_married:"Y",
                gender:"Female",
                user_is_active:"Y",
                is_admin:"N"
                
              }
        ])
    }])
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("heirachy_table");
};
