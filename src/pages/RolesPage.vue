<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_roles_title"
    >
      {{ $t('RolesPage.text.title') }}
    </h4>
    <roles-table
      v-model:filter-name="roleName"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
      v-model:total-elements="totalElements"
      :roles="roles"
      :detach-action="false"
      :loading="loading"
      :no-data-label="$t('RolesTable.text.noData')"
      :no-data-icon="$t('RolesTable.icon.noData')"
      @show="goToRole"
      @remove="openRemoveRoleDialog"
      @on-filter="search"
    />
  </q-page>
</template>

<script setup>
import RolesTable from 'src/components/tables/RolesTable.vue';
import * as RoleService from 'src/services/RoleService';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';

const router = useRouter();
const route = useRoute();
const roles = ref([]);
const roleName = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);
let reloadRolesEventRef;

/**
 * Go to role page.
 * @param {string} id - Role id.
 */
function goToRole(id) {
  router.push(`/roles/${id}`);
}

/**
 * Open dialog to remove role.
 * @param {object} role - Role object to remove for the dialog.
 */
function openRemoveRoleDialog(role) {
  DialogEvent.next({
    key: 'remove-role',
    type: 'open',
    role,
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

  if (currentPage.value !== 1) {
    queryParameters.push(`page=${currentPage.value}`);
  }

  if (roleName.value?.length > 0) {
    queryParameters.push(`name=${roleName.value}`);
  }

  router.push(queryParameters.length > 0 ? `/roles?${queryParameters.join('&')}` : '/roles');
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains role filters.
 */
function getFilters() {
  const filters = {};

  if (roleName.value?.length > 0) {
    filters.name = `lk_*${roleName.value}*`;
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
 * Search and display roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  loading.value = true;
  updateRoute();

  return RoleService.find(getFilters()).then((data) => {
    roles.value = data.content;
    currentPage.value = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    elementsPerPage.value = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
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
    roleName.value = query.name;
  }
}

onMounted(async () => {
  init(route.query);
  reloadRolesEventRef = ReloadRolesEvent.subscribe(search);

  await search();
});

onUnmounted(() => {
  reloadRolesEventRef.unsubscribe();
});
</script>
