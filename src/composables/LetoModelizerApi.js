import { api } from 'boot/axios';
import { getUserSessionToken } from 'src/composables/UserAuthentication';

/**
 * Retrieve (GET request) information about the current user.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getUserInformation(sessionToken) {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': sessionToken,
    },
  };

  return api.get('/api/users/me', headers);
}

/**
 * Get all roles of a user.
 * @param {string} userId - User id.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object[]>} Return an array of roles. Role is an object from ParseServer.
 * See documentation for more information.
 * @see https://docs.parseplatform.org/
 */
export async function getUserRoles(userId, sessionToken) {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': sessionToken,
    },
  };
  const queryParameters = `where={"users":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}`;

  return api.get(`/api/roles?${queryParameters}`, headers);
}

/**
 * Get all libraries.
 * @returns {Promise<object[]>} Promise with an array of libraries on success
 * otherwise an error.
 */
export async function getLibraries() {
  const config = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': getUserSessionToken(),
    },
  };
  const queryParameters = 'limit=10';

  return api.get(`/api/classes/Library?${queryParameters}`, config);
}

/**
 * Get all roles.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function getRoles() {
  const config = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': getUserSessionToken(),
    },
  };
  const queryParameters = 'limit=10';

  return api.get(`/api/classes/_Role?${queryParameters}`, config);
}
