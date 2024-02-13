import { api, manageError } from 'boot/axios';

/**
 * Get all roles.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/roles')
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get all roles of a user by its login.
 * @param {string} userLogin - User login.
 * @returns {Promise<object[]>} Return an array of roles.
 */
export async function findByLogin(userLogin) {
  return api.get(`/users/${userLogin}/roles`)
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Create role.
 * @param {string} name - Role name.
 * @returns {Promise<object>} Promise with role object on success otherwise an error.
 */
export async function create(name) {
  return api.post('/roles', { name })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Remove role by id.
 * @param {string} id - Role id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/roles/${id}`)
    .catch(manageError);
}
