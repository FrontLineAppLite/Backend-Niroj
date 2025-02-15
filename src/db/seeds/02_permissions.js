exports.seed = async function (knex) {
  // Clear bridging first, if needed
  await knex('role_permissions').del();

  // Clear the permissions table
  await knex('permissions').del();

  // Insert permissions
  await knex('permissions').insert([
    { id: 1, name: 'can_create_task', description: 'Create tasks' },
    { id: 2, name: 'can_edit_task', description: 'Edit tasks' },
    { id: 3, name: 'can_approve_shifts', description: 'Approve shift requests' },
  ]);
};
