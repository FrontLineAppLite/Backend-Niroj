// src/services/authService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');         // If you need roles
const Permission = require('../models/Permission'); // If you need permissions
const tokenUtils = require('../utils/tokenUtils');
const mongoose = require('mongoose');

/**
 * register():
 * - Called if you want to store local user data AFTER Okta user is created
 */
async function register({ email, firstName, lastName, roleName, oktaId }) {
  // 1. Create a new user in Mongo
  const newUser = await User.create({
    email,
    firstName,
    lastName,
    authProviderId: oktaId
  });

  // 2. If a roleName is provided, find (or create) that role
  if (roleName) {
    let role = await Role.findOne({ name: roleName });
    if (!role) {
      // If no such role in DB, create it on the fly
      role = await Role.create({
        name: roleName,
        description: `Auto-created role: ${roleName}`
      });
    }
    // 3. Assign the role to this user
    // Assuming "roles" is an array on the user model:
    newUser.roles.push(role._id);
    // If you only want one role, do: newUser.role = role._id;
    await newUser.save();
  }

  return { message: 'User registered via Okta', userId: newUser._id };
}

/**
 * login():
 * - We assume the client obtains an Okta token (ID token).
 * - We validate it, find or create local user record, then issue an internal token.
 */
async function login({ authProviderToken }) {
  if (!authProviderToken) {
    throw new Error('No Okta token provided.');
  }

  // 1. Validate the token with Okta
  const verifiedPayload = await validateOktaToken(authProviderToken);

  // 2. Lookup local user by okta sub
  let user = await User.findOne({ authProviderId: verifiedPayload.sub }).exec();

  // 3. Auto-create if not found
  if (!user) {
    user = await User.create({
      authProviderId: verifiedPayload.sub,
      email: verifiedPayload.email,
      firstName: verifiedPayload.given_name || null,
      lastName: verifiedPayload.family_name || null,
    });
  }

  // 4. Gather roles (if you store role references in the user doc or separate)
  // e.g. user.roles might be an array of Role ObjectIds
  // let roles = [];
  // if (user.roles && user.roles.length > 0) {
  //   roles = user.roles.map(r => r.toString());
  // }

  // 5. Create your own internal token
  const internalToken = tokenUtils.generateToken({
    userId: user._id,
    // roles,
  });

  return { token: internalToken };
}

/**
 * verifyToken():
 * - Verifies the internal token’s signature, fetches user from Mongo if needed.
 */
async function verifyToken(internalToken) {
  try {
    const payload = jwt.verify(internalToken, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).exec();
    if (!user) throw new Error('User does not exist');
    // If you store roles or permissions, you could fetch them here
    // e.g. const roles = await Role.find({ _id: { $in: user.roles } });

    return { user /*, roles*/ };
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * resetPassword():
 * - Typically done via Okta. Possibly no local DB changes needed here.
 */
async function resetPassword({ email }) {
  // Optionally confirm the user exists in Mongo
  const user = await User.findOne({ email }).exec();
  if (!user) throw new Error('User not found');

  // In real usage, you'd call Okta's API or do another flow
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