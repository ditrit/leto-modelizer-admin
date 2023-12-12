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
        path: '/user-groups',
        children: [
          { path: '', component: () => import('pages/UserGroupsPage.vue') },
        ],
      },
      {
        path: '/roles',
        children: [
          { path: '', component: () => import('pages/RolesPage.vue') },
        ],
      },
      {
        path: '/libraries',
        children: [
          { path: '', component: () => import('pages/LibrariesPage.vue') },
          { path: '/libraries/:id', component: () => import('pages/LibraryPage.vue') },
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
