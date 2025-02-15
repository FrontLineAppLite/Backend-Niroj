exports.seed = async function (knex) {
  // 1. Clear bridging tables that depend on roles
  await knex('role_permissions').del();
  await knex('user_roles').del(); // If you want to remove all references to roles from users as well

  // 2. Clear the 'roles' table
  await knex('roles').del();

  // 3. Insert fresh roles
  await knex('roles').insert([
    { id: 1, name: 'Admin', description: 'Full system access' },
    { id: 2, name: 'Manager', description: 'Managerial privileges' },
    { id: 3, name: 'Employee', description: 'Regular employee usage' },
  ]);
};
