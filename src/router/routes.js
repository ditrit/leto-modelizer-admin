const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/users',
    children: [
      {
        path: '/users',
        children: [
          { path: '', component: () => import('pages/UsersPage.vue') },
        ],
      },
      {
        path: '/libraries',
        children: [
          { path: '', component: () => import('pages/LibrariesPage.vue') },
        ],
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
