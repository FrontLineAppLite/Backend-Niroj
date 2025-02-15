exports.up = function (knex) {
  return knex.schema.createTable('user_roles', (table) => {
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['user_id', 'role_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_roles');
};
