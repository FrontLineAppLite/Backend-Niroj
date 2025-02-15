exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // or use .uuid() if you prefer
    table.string('auth_provider_id').unique().comment('Okta user ID');
    table.string('email').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.string('status').defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
