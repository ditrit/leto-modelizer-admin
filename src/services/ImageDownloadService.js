import { prepareRequest } from 'boot/axios';

/**
 * Get image by url.
 * @param {string} url - Url of image to retrieve.
 * @returns {Promise<string>} Return a image on success, otherwise an error.
 */
export async function downloadImage(url) {
  const api = await prepareRequest();

  return api.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      const imageBase64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
      return `data:${response.headers['content-type']};base64,${imageBase64}`;
    });
}

/**
 * Get user picture by login.
 * @param {string} login - User login.
 * @returns {Promise<string>} Return a user picture on success, otherwise an error.
 */
export async function getUserPicture(login) {
  return downloadImage(`/users/${login}/picture`);
}

/**
 * Get library icon by id.
 * @param {string} id - Library id.
 * @returns {Promise<string>} Return a library icon on success, otherwise an error.
 */
export async function getLibraryIcon(id) {
  return downloadImage(`/libraries/${id}/icon`);
}

/**
 * Get template icon by id.
 * @param {string} id - Template id.
 * @returns {Promise<string>} Return a template icon on success, otherwise an error.
 */
export async function getTemplateIcon(id) {
  return downloadImage(`/libraries/templates/${id}/icon`);
}

/**
 * Get template schema by template id and its index.
 * @param {string} id - Template id.
 * @param {number} index - Template schema index in schema array.
 * @returns {Promise<string>} Return a template schema on success, otherwise an error.
 */
export async function getTemplateSchema(id, index) {
  return downloadImage(`/libraries/templates/${id}/schemas/${index}`);
}
