exports.seed = async function (knex) {
  // Clear existing bridging data
  await knex('role_permissions').del();

  // Link roles to permissions
  // Admin has everything:
  await knex('role_permissions').insert([
    { role_id: 1, permission_id: 1 },
    { role_id: 1, permission_id: 2 },
    { role_id: 1, permission_id: 3 },
  ]);

  // Manager can create/edit tasks, approve shifts
  await knex('role_permissions').insert([
    { role_id: 2, permission_id: 1 },
    { role_id: 2, permission_id: 2 },
    { role_id: 2, permission_id: 3 },
  ]);

  // Employee can only create/edit tasks
  await knex('role_permissions').insert([
    { role_id: 3, permission_id: 1 },
    { role_id: 3, permission_id: 2 },
  ]);
};
