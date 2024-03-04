import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useCsrfStore } from 'stores/CsrfTokenStore';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'delete'].includes(config.method)) {
      const {
        token,
        headerName,
      } = useCsrfStore();

      config.headers[headerName] = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if ([403, 401].includes(error.response.status)) {
      window.location.href = process.env.LETO_MODELIZER_URL;
    }
    return Promise.reject(error);
  },
);

/**
 * Asynchronously prepares a request by ensuring the availability of a valid CSRF token.
 *
 * This function uses a CSRF token to check if token is valid.
 * If not, it fetches a new CSRF token from the server using the provided API.
 * The retrieved CSRF token is then stored in the CSRF token store for future use.
 * @returns {Promise<object>} The API instance with an updated CSRF token.
 */
async function prepareRequest() {
  const csrfStore = useCsrfStore();
  const currentTime = new Date().getTime();

  if (!csrfStore.expirationDate || csrfStore.expirationDate < currentTime) {
    const csrf = await api.get('/csrf').then(({ data }) => data);

    csrfStore.headerName = csrf.headerName;
    csrfStore.token = csrf.token;
    csrfStore.expirationDate = csrf.expirationDate;
  }

  return api;
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

export { prepareRequest };
