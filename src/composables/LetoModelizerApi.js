import { api } from 'boot/axios';
import { getUserSessionToken } from 'src/composables/UserAuthentication';

/**
 * Redirect on Leto-modelizer on status 503, otherwise throw error.
 * @param {Error} error - Error from axios.
 */
export function manageError(error) {
  if (error.response.status === 503) {
    window.location.href = process.env.LETO_MODELIZER_URL;
    return;
  }
  throw error;
}

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

  return api.get('/api/users/me', headers)
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
export async function getUserRoles(userId, sessionToken) {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': sessionToken,
    },
  };
  const queryParameters = `where={"users":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}`;

  return api.get(`/api/roles?${queryParameters}`, headers)
    .catch(manageError);
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

  return api.get(`/api/classes/Library?${queryParameters}`, config)
    .catch(manageError);
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

  return api.get(`/api/classes/_Role?${queryParameters}`, config)
    .catch(manageError);
}

/**
 * Get library by id.
 * @param {string} id - Library id.
 * @returns {Promise<object>} Return a library.
 */
export async function getLibraryById(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': getUserSessionToken(),
    },
  };

  return api.get(`/api/classes/Library/${id}`, config)
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get all userGroups.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object[]>} Promise with an array of userGroups on success
 * otherwise an error.
 */
export async function getUserGroups(sessionToken) {
  const config = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': sessionToken,
    },
  };
  const queryParameters = 'limit=10';

  return api.get(`/api/classes/Group?${queryParameters}`, config);
}
