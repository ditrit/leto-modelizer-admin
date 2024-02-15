import { api } from 'boot/axios';

/**
 * Get all groups.
 * @returns {Promise<object[]>} Promise with an array of groups on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/groups').then(({ data }) => data);
}

/**
 * Get group by id.
 * @param {string} id - Group id.
 * @returns {Promise<object>} Return a group.
 */
export async function findById(id) {
  return api.get(`/groups/${id}`).then(({ data }) => data);
}

/**
 * Create group.
 * @param {string} name - Group name.
 * @returns {Promise<object>} Promise with group object on success otherwise an error.
 */
export async function create(name) {
  return api.post('/groups', { name }).then(({ data }) => data);
}

/**
 * Remove group by id.
 * @param {string} id - Group id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/groups/${id}`);
}

/**
 * Get all groups of a user by its login.
 * @param {string} login - User login.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findByLogin(login) {
  return api.get(`users/${login}/groups`).then(({ data }) => data);
}

/**
 * Associate group and user.
 * @param {string} userLogin - User login.
 * @param {string} groupId - Group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateGroupAndUser(userLogin, groupId) {
  return api.post(`/groups/${groupId}/users`, userLogin, {
    headers: {
      'Content-Type': 'text/plain',
    },
  }).then(({ data }) => data);
}

/**
 * Dissociate group and user.
 * @param {string} userLogin - User login.
 * @param {string} groupId - Group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateGroupAndUser(userLogin, groupId) {
  return api.delete(`/groups/${groupId}/users/${userLogin}`);
}
