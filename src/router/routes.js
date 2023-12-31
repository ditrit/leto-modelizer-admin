const routes = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/users',
    meta: {
      name: 'users',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UsersPage.vue') },
      { path: '/users/:id', component: () => import('pages/UserPage.vue') },
    ],
  },
  {
    path: '/user-groups',
    meta: {
      name: 'userGroups',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UserGroupsPage.vue') },
      { path: '/user-groups/:id', component: () => import('pages/UserGroupPage.vue') },
    ],
  },
  {
    path: '/roles',
    meta: {
      name: 'roles',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RolesPage.vue') },
    ],
  },
  {
    path: '/libraries',
    meta: {
      name: 'libraries',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LibrariesPage.vue') },
      { path: '/libraries/:id', component: () => import('pages/LibraryPage.vue') },
      { path: '/add-library', component: () => import('pages/AddLibraryPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
