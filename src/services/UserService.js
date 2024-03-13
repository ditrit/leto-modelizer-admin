import { prepareRequest } from 'boot/axios';

/**
 * Get information about the current user.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getCurrent() {
  const api = await prepareRequest();

  return api.get('/users/me').then(({ data }) => data);
}

/**
 * Get permissions of the current user.
 * @returns {Promise<object>} Promise with the permissions of logged-in user on success
 * otherwise an error.
 */
export async function getMyPermissions() {
  const api = await prepareRequest();

  return api.get('/users/me/permissions').then(({ data }) => data);
}

/**
 * Get all users.
 * @returns {Promise<object[]>} Promise with an array of users on success
 * otherwise an error.
 */
export async function find() {
  const api = await prepareRequest();

  return api.get('/users').then(({ data }) => data);
}

/**
 * Get user by login.
 * @param {string} login - User login.
 * @returns {Promise<object>} Return a user.
 */
export async function findByLogin(login) {
  const api = await prepareRequest();

  return api.get(`/users/${login}`).then(({ data }) => data);
}

/**
 * Remove user by id.
 * @param {string} id - User id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  const api = await prepareRequest();

  return api.delete(`/users/${id}`);
}

/**
 * Get all users of a group.
 * @param {string} groupId - Group id.
 * @returns {Promise<object[]>} Return an array of users.
 */
export async function findByGroupId(groupId) {
  const api = await prepareRequest();

  return api.get(`groups/${groupId}/users`)
    .then(({ data }) => data);
}

/**
 * Get all users of a role.
 * @param {string} roleId - Role id.
 * @returns {Promise<object[]>} Return an array of users.
 */
export async function findByRoleId(roleId) {
  const api = await prepareRequest();

  return api.get(`roles/${roleId}/users`)
    .then(({ data }) => data);
}
