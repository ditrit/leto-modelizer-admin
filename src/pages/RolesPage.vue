<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_roles_title"
    >
      {{ $t('RolesPage.text.title') }}
    </h4>
    <access-control-table
      v-model:filter-name="filters.name"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
      v-model:total-elements="totalElements"
      access-control-type="role"
      :rows="roles"
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
import AccessControlTable from 'src/components/tables/AccessControlTable.vue';
import * as RoleService from 'src/services/RoleService';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';
import AccessControlNameFilter from 'src/composables/filters/AccessControlNameFilter';

const router = useRouter();
const route = useRoute();
const roles = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter([
  new PageFilter(),
  new CountFilter(),
  new AccessControlNameFilter(),
]);

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
  const query = new URLSearchParams(generateQuery()).toString();
  const querySuffix = query.length > 0 ? `?${query}` : '';

  router.push(`/roles${querySuffix}`);
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
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
  });
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
