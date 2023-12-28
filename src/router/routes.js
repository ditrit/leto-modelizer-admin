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
          { path: '/users/:id', component: () => import('pages/UserPage.vue') },
        ],
      },
      {
        path: '/user-groups',
        children: [
          { path: '', component: () => import('pages/UserGroupsPage.vue') },
          { path: '/user-groups/:id', component: () => import('pages/UserGroupPage.vue') },
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
