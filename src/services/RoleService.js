import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Initialize the type of a role based on its name.
 * @param {object} role - The role object.
 * @returns {object} The modified role object with the 'type' property set.
 */
function initRole(role) {
  if (role.name.startsWith('lib_')) {
    role.type = 'Library';
  } else if (role.name.startsWith('CF_') || role.name === 'admin') {
    role.type = 'System';
  } else {
    role.type = 'Functional';
  }
  return role;
}

/**
 * Get all roles.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/api/classes/_Role', { headers: getDefaultHeaders() })
    .then(({ data }) => data.results.map(initRole))
    .catch(manageError);
}

/**
 * Get all roles of a user.
 * @param {string} userId - User id.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object[]>} Return an array of roles. Role is an object from ParseServer.
 * See documentation for more information.
 * @see https://docs.parseplatform.org/
 */
export async function findByUserId(userId, sessionToken) {
  const queryParameters = `where={"users":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}`;

  return api.get(`/api/roles?${queryParameters}`, { headers: getDefaultHeaders(sessionToken) })
    .then(({ data }) => data.results.map(initRole))
    .catch(manageError);
}
