import { api } from 'boot/axios';

/**
 * Get all roles.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/roles').then(({ data }) => data);
}

/**
 * Get all roles of a user by its login.
 * @param {string} userLogin - User login.
 * @returns {Promise<object[]>} Return an array of roles.
 */
export async function findByLogin(userLogin) {
  return api.get(`/users/${userLogin}/roles`).then(({ data }) => data);
}

/**
 * Create role.
 * @param {string} name - Role name.
 * @returns {Promise<object>} Promise with role object on success otherwise an error.
 */
export async function create(name) {
  return api.post('/roles', { name }).then(({ data }) => data);
}

/**
 * Remove role by id.
 * @param {string} id - Role id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/roles/${id}`);
}

/**
 * Associate role and user.
 * @param {string} userLogin - User login.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateRoleAndUser(userLogin, roleId) {
  return api.post(`/roles/${roleId}/users`, userLogin, {
    headers: {
      'Content-Type': 'text/plain',
    },
  }).then(({ data }) => data);
}

/**
 * Dissociate role and user.
 * @param {string} userLogin - User login.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateRoleAndUser(userLogin, roleId) {
  return api.delete(`/roles/${roleId}/users/${userLogin}`);
}
