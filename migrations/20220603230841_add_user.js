exports.up = async function (knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments("user_id").primary();
        table.string("password");
        table.string("first_name");
        table.string("last_name");
        table.string("email");
        table.string("phone_number");
        table.string("picture");
        table.string("gender"); //type Male or Female
        table.string("description"); 
        table.string("extra_keys"); 
        table.date("dob");
        table.integer("wife_id")
        table.integer("heirachy_id")
        table.integer("husband_id")
        table.integer("user_level");
        table.enu('is_son_of', ['Y', 'N']).defaultTo('N');
        table.enu('is_daughter_of', ['Y', 'N']).defaultTo('N');
        table.enu('is_married', ['Y', 'N']).defaultTo('N');
        table.enu('user_is_active', ['Y', 'N']).defaultTo('Y');
        table.enu('is_admin', ['Y', 'N']).defaultTo('N');
        table.integer("created_by").defaultTo();
        table.datetime("created_at").defaultTo();
        table.integer("updated_by").defaultTo();
        table.datetime("updated_at").defaultTo();

    });

    await knex('users').insert([
        {
           heirachy_id:1,
           email:"admin@123",
           password:"admin@123",
           first_name:"Admin",
           last_name:"",
           user_level:0,
           is_admin:"Y"
           
        },
        {
           heirachy_id:1,
           first_name:"Mr. ",
           last_name:"Shroff",
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
            heirachy_id:1,
            first_name:"Mrs.",
            last_name:"Shroff",
            email:"ajitmaurya3216@gmail.com",
            is_admin:"Y",
            is_married:"Y",
            gender:"Female",
            user_is_active:"Y",
            is_admin:"N"
            
          }
    ])

};


exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("users");

};
