import { api, manageError } from 'boot/axios';

/**
 * Get information about the current user.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getCurrent() {
  return api.get('/users/me')
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get picture of the current user.
 * @returns {Promise<object>} Promise with the logged-in user picture on success
 * otherwise an error.
 */
export async function getMyPicture() {
  return api.get('/users/me/picture', {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      const imageBase64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
      return `data:${response.headers['content-type']};base64,${imageBase64}`;
    })
    .catch(manageError);
}

/**
 * Get permissions of the current user.
 * @returns {Promise<object>} Promise with the permissions of logged-in user on success
 * otherwise an error.
 */
export async function getMyPermissions() {
  return api.get('/users/me/permissions')
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get all users.
 * @returns {Promise<object[]>} Promise with an array of users on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/users')
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get user by login.
 * @param {string} login - User login.
 * @returns {Promise<object>} Return a user.
 */
export async function findByLogin(login) {
  return api.get(`/users/${login}`)
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get user picture by login.
 * @param {string} login - User login.
 * @returns {Promise<string>} Return a user picture on success, otherwise an error.
 */
export async function getPictureByLogin(login) {
  return api.get(`/users/${login}/picture`, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      const imageBase64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
      return `data:${response.headers['content-type']};base64,${imageBase64}`;
    })
    .catch((error) => {
      if (error.response.status === 404) {
        return '';
      }
      return manageError(error);
    });
}

/**
 * Remove user by id.
 * @param {string} id - User id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/users/${id}`)
    .catch(manageError);
}

/**
 * Get all users of a group.
 * @param {string} groupId - Group id.
 * @returns {Promise<object[]>} Return an array of users.
 */
export async function findByGroupId(groupId) {
  return api.get(`groups/${groupId}/users`)
    .then(({ data }) => data)
    .catch(manageError);
}
