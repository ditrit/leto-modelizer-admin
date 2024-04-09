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
      v-model:filter-name="groupName"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
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

const router = useRouter();
const route = useRoute();
const groups = ref([]);
const groupName = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);

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
  const queryParameters = [];

  if (elementsPerPage.value !== 10) {
    queryParameters.push(`size=${elementsPerPage.value}`);
  }

  if (currentPage.value !== 1) {
    queryParameters.push(`page=${currentPage.value}`);
  }

  if (groupName.value?.length > 0) {
    queryParameters.push(`name=${groupName.value}`);
  }

  router.push(queryParameters.length > 0 ? `/groups?${queryParameters.join('&')}` : '/groups');
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains role filters.
 */
function getFilters() {
  const filters = {};

  if (groupName.value?.length > 0) {
    filters.name = `lk_*${groupName.value}*`;
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
 * Get groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  loading.value = true;
  updateRoute();

  return GroupService.find(getFilters()).then((data) => {
    groups.value = data.content;
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
    groupName.value = query.name;
  }
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
