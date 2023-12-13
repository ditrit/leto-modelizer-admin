import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from 'src/router/routes';
import { getUserSessionToken, initUser } from 'src/composables/UserAuthentication';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(async () => {
  let createHistory;

  if (process.env.SERVER) {
    createHistory = createMemoryHistory;
  } else if (process.env.VUE_ROUTER_MODE === 'history') {
    createHistory = createWebHistory;
  } else {
    createHistory = createWebHashHistory;
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const matches = /.+[?&]token=([^&]+)/.exec(window.location.href);

    if (matches) {
      localStorage.setItem('sessionToken', matches[1]);
      // Redirect to admin without token in url.
      window.location.href = window.location.href.replaceAll(/\?.+$/g, '');
    } else if (getUserSessionToken()) {
      initUser(getUserSessionToken());
      next();
    } else {
      // Redirect to leto-modelizer in case of not connected user.
      window.location.href = `${process.env.LETO_MODELIZER_URL}/admin`;
    }
  });

  return Router;
});
