<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_roles_title"
    >
      {{ $t('RolesPage.text.title') }}
    </h4>
    <div class="row justify-between items-center q-mb-md">
      <role-filters-card
        :name="filterRoleName"
        @update:name="searchByName"
      />
      <table-pagination-card
        :current="paginationCurrent"
        :max="paginationMax"
        :total="paginationTotal"
        :size="paginationSize"
        @update:current="updatePage"
        @update:size="updateSize"
      />
    </div>
    <roles-table
      :roles="roles"
      :detach-action="false"
      @show="goToRole"
      @remove="openRemoveRoleDialog"
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
import TablePaginationCard from 'components/card/TablePaginationCard.vue';
import RoleFiltersCard from 'components/card/RoleFiltersCard.vue';

const router = useRouter();
const route = useRoute();
const roles = ref([]);
const paginationCurrent = ref(1);
const paginationMax = ref(1);
const paginationSize = ref(10);
const paginationTotal = ref(0);
const filterRoleName = ref('');
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

  if (paginationSize.value !== 10) {
    queryParameters.push(`size=${paginationSize.value}`);
  }

  if (paginationCurrent.value !== 1) {
    queryParameters.push(`page=${paginationCurrent.value}`);
  }

  if (filterRoleName.value.length > 0) {
    queryParameters.push(`name=${filterRoleName.value}`);
  }

  router.push(queryParameters.length > 0 ? `/roles?${queryParameters.join('&')}` : '/roles');
}

/**
 * Search and display roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  updateRoute();

  return RoleService.find({
    name: filterRoleName.value?.length > 0 ? `lk_*${filterRoleName.value.toUpperCase()}*` : null,
    page: `${paginationCurrent.value - 1}`,
    count: `${paginationSize.value}`,
  }).then((data) => {
    roles.value = data.content;
    paginationCurrent.value = data.pageable.pageNumber + 1;
    paginationMax.value = data.totalPages;
    paginationSize.value = data.size;
    paginationTotal.value = data.totalElements;
  });
}

/**
 * Set filter role name and call search roles.
 * @param {string} value - Filter role name.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function searchByName(value) {
  filterRoleName.value = value;
  return search();
}

/**
 * Set current page and call search roles.
 * @param {number} value - Current page value.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function updatePage(value) {
  paginationCurrent.value = value;
  return search();
}

/**
 * Set page size and call search roles.
 * @param {number} value - Page size value.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function updateSize(value) {
  paginationSize.value = value;
  return search();
}

/**
 * Init filters and pagination from query parameters in url.
 */
function init() {
  if (route.query.size) {
    paginationSize.value = route.query.size;
  }
  if (route.query.page) {
    paginationCurrent.value = route.query.page;
  }
  if (route.query.name) {
    filterRoleName.value = route.query.name;
  }
}

onMounted(async () => {
  init();
  reloadRolesEventRef = ReloadRolesEvent.subscribe(search);

  await search();
});

onUnmounted(() => {
  reloadRolesEventRef.unsubscribe();
});
</script>
