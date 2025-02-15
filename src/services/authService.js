const jwt = require('jsonwebtoken');
const knex = require('knex');
const config = require('../../knexfile');
const db = knex(config[process.env.NODE_ENV || 'development']);
const tokenUtils = require('../utils/tokenUtils');

/**
 * register():
 * - Called if you want to store local user data AFTER Okta user is created
 * - No local password hash. 
 */
async function register({ email, firstName, lastName, roleId, oktaId }) {
  // Insert user referencing the Okta ID
  // e.g. "00u12345abcXYZ"
  const [userIdObj] = await db('users')
    .insert({
      email,
      first_name: firstName,
      last_name: lastName,
      auth_provider_id: oktaId,
    })
    .returning('id');

  // For Postgres + Knex, userIdObj might be a number or an object { id: 123 }
  const newUserId = typeof userIdObj === 'object' ? userIdObj.id : userIdObj;

  if (roleId) {
    await db('user_roles').insert({ user_id: newUserId, role_id: roleId });
  }

  return { message: 'User registered via Okta', userId: newUserId };
}

/**
 * login():
 * - We assume the client obtains an Okta token (ID token).
 * - We validate it, find or create local user record, then issue an internal token if desired.
 */
async function login({ authProviderToken }) {
  if (!authProviderToken) {
    throw new Error('No Okta token provided.');
  }

  // 1. Validate the token with Okta
  const verifiedPayload = await validateOktaToken(authProviderToken);

  // 2. Lookup local user by okta sub
  let user = await db('users').where({ auth_provider_id: verifiedPayload.sub }).first();

  // 3. Auto-create if not found (if that’s your desired behavior)
  if (!user) {
    const [newUserIdObj] = await db('users')
      .insert({
        auth_provider_id: verifiedPayload.sub,
        email: verifiedPayload.email,
        first_name: verifiedPayload.given_name || null,
        last_name: verifiedPayload.family_name || null,
      })
      .returning('id');

    const newUserId = typeof newUserIdObj === 'object' ? newUserIdObj.id : newUserIdObj;
    user = { id: newUserId, email: verifiedPayload.email };
  }

  // 4. Gather roles
  const roles = await db('user_roles').where({ user_id: user.id });

  // 5. Create your own internal token if your other microservices need it
  const internalToken = tokenUtils.generateToken({
    userId: user.id,
    roles: roles.map((r) => r.role_id),
  });

  return { token: internalToken };
}

/**
 * verifyToken():
 * - Verifies the internal token’s signature, fetches user from DB if needed.
 */
async function verifyToken(internalToken) {
  try {
    const payload = jwt.verify(internalToken, process.env.JWT_SECRET);
    const user = await db('users').where({ id: payload.userId }).first();
    if (!user) throw new Error('User does not exist');

    const roles = await db('user_roles').where({ user_id: user.id });
    return { user, roles };
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * resetPassword():
 * - This is Okta's responsibility. We might just call Okta's API or do nothing.
 */
async function resetPassword({ email }) {
  // Check if user exists locally
  const user = await db('users').where({ email }).first();
  if (!user) throw new Error('User not found');

  // Typically you'd direct them to Okta’s reset flow
  return { message: 'Password reset initiated via Okta' };
}

/**
 * Pseudo-code for validating Okta token.
 */
async function validateOktaToken(token) {
  // In production: use an Okta library or JWKS to verify signature.
  // Return a payload with sub, email, etc.
  return {
    sub: 'oktaUniqueUserId123',
    email: 'test@example.com',
    given_name: 'John',
    family_name: 'Doe',
  };
}

module.exports = {
  register,
  login,
  verifyToken,
  resetPassword,
};
