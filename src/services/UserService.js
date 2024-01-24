import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get information about the current user.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function findCurrent(sessionToken) {
  return api.get('/api/users/me', { headers: getDefaultHeaders(sessionToken) })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get all users.
 * @returns {Promise<object[]>} Promise with an array of users on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/api/Users', { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
    .catch(manageError);
}

/**
 * Get user by id.
 * @param {string} id - User id.
 * @returns {Promise<object>} Return a user.
 */
export async function findById(id) {
  return api.get(`/api/Users/${id}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Remove user by id.
 * @param {string} id - User id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/api/Users/${id}`, { headers: getDefaultHeaders() })
    .catch(manageError);
}

/**
 * Add user to the "users" field of the group.
 * @param {string} userId - User id.
 * @param {string} groupId - Group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
async function addUserToGroup(userId, groupId) {
  return api.put(
    `/api/classes/Group/${groupId}`,
    {
      users: {
        __op: 'AddRelation',
        objects: [
          {
            __type: 'Pointer',
            className: '_User',
            objectId: userId,
          },
        ],
      },
    },
    { headers: getDefaultHeaders() },
  );
}

/**
 * Attach groups to user.
 * @param {string} userId - User id.
 * @param {string[]} groupIds - Array of group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function attachGroups(userId, groupIds) {
  return Promise.allSettled(groupIds.map((groupId) => addUserToGroup(userId, groupId)))
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          return manageError(result.reason);
        }
        return result;
      });
    });
}
