<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_users_title"
    >
      {{ $t('IndexPage.text.title') }}
    </h4>
    <users-table
      v-model:filter-name="userName"
      v-model:filter-login="userLogin"
      v-model:filter-email="userEmail"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
      v-model:total-elements="totalElements"
      :users="users"
      :detach-action="false"
      :loading="loading"
      :no-data-label="$t('UsersTable.text.noData')"
      :no-data-icon="$t('UsersTable.icon.noData')"
      @show="goToUser"
      @remove="openRemoveUserDialog"
      @on-filter="search"
    />
  </q-page>
</template>

<script setup>
import UsersTable from 'src/components/tables/UsersTable.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as UserService from 'src/services/UserService';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';

const router = useRouter();
const route = useRoute();
const users = ref([]);
const userName = ref('');
const userLogin = ref('');
const userEmail = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);

let reloadUsersEventRef;

/**
 * Go to user page.
 * @param {string} login - User login.
 */
function goToUser(login) {
  router.push(`/users/${login}`);
}

/**
 * Open dialog to remove user.
 * @param {object} user - User object to remove for the dialog.
 */
function openRemoveUserDialog(user) {
  DialogEvent.next({
    key: 'remove-user',
    type: 'open',
    user,
  });
}

/**
 * Update route url with value of filters and pagination.
 */
function updateRoute() {
  const queryParameters = [];

  if (elementsPerPage.value !== 10) {
    queryParameters.push(`size=${elementsPerPage.value}`);
  }

  if (currentPage.value > 1) {
    queryParameters.push(`page=${currentPage.value}`);
  }

  if (userName.value?.length > 0) {
    queryParameters.push(`name=${userName.value}`);
  }

  if (userLogin.value?.length > 0) {
    queryParameters.push(`login=${userLogin.value}`);
  }

  if (userEmail.value?.length > 0) {
    queryParameters.push(`email=${userEmail.value}`);
  }

  router.push(queryParameters.length > 0 ? `/users?${queryParameters.join('&')}` : '/users');
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains user filters.
 */
function getFilters() {
  const filters = {};

  if (userName.value?.length > 0) {
    filters.name = `lk_*${userName.value}*`;
  }

  if (userLogin.value?.length > 0) {
    filters.login = `lk_*${userLogin.value}*`;
  }

  if (userEmail.value?.length > 0) {
    filters.email = `lk_*${userEmail.value}*`;
  }

  if (currentPage.value >= 1) {
    filters.page = `${currentPage.value - 1}`;
  }

  if (elementsPerPage.value !== 10) {
    filters.count = `${elementsPerPage.value}`;
  }

  return filters;
}

/**
 * Search and display users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  loading.value = true;
  updateRoute();

  return UserService.find(getFilters())
    .then((data) => {
      users.value = data.content;
      currentPage.value = data.pageable.pageNumber + 1;
      maxPage.value = data.totalPages;
      elementsPerPage.value = data.size;
      totalElements.value = data.totalElements;

      return Promise.resolve();
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Init filters and pagination from query parameters in url.
 * @param {object} query - URL query parameters.
 */
function init(query) {
  if (query.size) {
    elementsPerPage.value = parseInt(query.size, 10) || 10;
  }

  if (query.page) {
    currentPage.value = parseInt(query.page, 10) || 0;
  }

  if (query.name) {
    userName.value = query.name;
  }

  if (query.login) {
    userLogin.value = query.login;
  }

  if (query.email) {
    userEmail.value = query.email;
  }
}

onMounted(async () => {
  init(route.query);
  reloadUsersEventRef = ReloadUsersEvent.subscribe(search);

  await search();
});

onUnmounted(() => {
  reloadUsersEventRef.unsubscribe();
});
</script>
