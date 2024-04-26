<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_users_title"
    >
      {{ $t('IndexPage.text.title') }}
    </h4>
    <users-table
      v-model:filter-name="filters.name"
      v-model:filter-login="filters.login"
      v-model:filter-email="filters.email"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
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
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import { userFilters } from 'src/composables/FiltersArray';

const router = useRouter();
const route = useRoute();
const users = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter(userFilters);

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
  const query = new URLSearchParams(generateQuery()).toString();
  const querySuffix = query.length > 0 ? `?${query}` : '';

  router.push(`/users${querySuffix}`);
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
      filters.value.page = data.pageable.pageNumber + 1;
      maxPage.value = data.totalPages;
      filters.value.count = data.size;
      totalElements.value = data.totalElements;

      return Promise.resolve();
    })
    .finally(() => {
      loading.value = false;
    });
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
