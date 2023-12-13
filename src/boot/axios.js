import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { getUserSessionToken } from 'src/composables/UserAuthentication';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/backend' });

/**
 * Get default headers for Api. If session token is not provided, use session token stored
 * in localStorage.
 * @param {string} sessionToken - Session to token to use.
 * @returns {object} Headers.
 */
function getDefaultHeaders(sessionToken) {
  return {
    Accept: 'application/json',
    'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
    'X-Parse-Session-Token': sessionToken || getUserSessionToken(),
  };
}

/**
 * Redirect on Leto-modelizer on status 503, otherwise throw error.
 * @param {Error} error - Error from axios.
 */
function manageError(error) {
  if (error.response.status !== 503) {
    throw error;
  }
  window.location.href = process.env.LETO_MODELIZER_URL;
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, getDefaultHeaders, manageError };
