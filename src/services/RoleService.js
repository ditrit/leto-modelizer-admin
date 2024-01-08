import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get all roles.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/api/classes/_Role', { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
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
    .then(({ data }) => data.results)
    .catch(manageError);
}
