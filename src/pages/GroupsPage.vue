<template>
  <q-page class="column q-pa-md bg-grey-1">
    <div class="row justify-center items-center">
      <h4
        class="q-ma-none q-mt-md q-mb-lg q-mr-auto"
        data-cy="page_groups_title"
      >
        {{ $t('GroupsPage.text.title') }}
      </h4>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white"
        data-cy="groups_button_add"
        :label="$t('GroupsPage.text.add')"
        :icon="$t('GroupsPage.icon.add')"
        @click="$router.push('/add-group')"
      />
    </div>
    <access-control-table
      v-model:filter-name="filters.name"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
      v-model:total-elements="totalElements"
      access-control-type="group"
      :rows="groups"
      :detach-action="false"
      :loading="loading"
      :no-data-label="$t('GroupsTable.text.noData')"
      :no-data-icon="$t('GroupsTable.icon.noData')"
      @show="goToGroup"
      @remove="openRemoveGroupDialog"
      @on-filter="search"
    />
  </q-page>
</template>

<script setup>
import AccessControlTable from 'src/components/tables/AccessControlTable.vue';
import { useRouter, useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import * as GroupService from 'src/services/GroupService';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';
import AccessControlNameFilter from 'src/composables/filters/AccessControlNameFilter';

const router = useRouter();
const route = useRoute();
const groups = ref([]);
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

let reloadGroupsEventRef;

/**
 * Go to user group page.
 * @param {string} id - User group id.
 */
function goToGroup(id) {
  router.push(`/groups/${id}`);
}

/**
 * Open dialog to remove user group.
 * @param {object} group - User group object to remove for the dialog.
 */
function openRemoveGroupDialog(group) {
  DialogEvent.next({
    key: 'remove-group',
    type: 'open',
    group,
  });
}

/**
 * Update route url with value of filters and pagination.
 */
function updateRoute() {
  // console.log('generateqUERY', generateQuery());
  const query = new URLSearchParams(generateQuery()).toString();
  const querySuffix = query.length > 0 ? `?${query}` : '';

  router.push(`/groups${querySuffix}`);
}

/**
 * Get groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  loading.value = true;
  updateRoute();

  return GroupService.find(getFilters()).then((data) => {
    groups.value = data.content;
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
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(search);
  await search();
});
onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
});
</script>
