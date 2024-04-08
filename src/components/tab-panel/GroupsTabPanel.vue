<template>
  <q-tab-panel
    name="groups"
    data-cy="groups_tab_panel"
  >
    <h6
      class="q-ma-none q-mb-sm"
      data-cy="groups_title"
    >
      {{ $t('GroupsTabPanel.text.title', { name: entity.name }) }}
    </h6>
    <q-banner
      v-if="isSuperAdmin"
      dense
      class="bg-warning text-white text-weight-bold q-mb-md"
      data-cy="tab_group_warning"
    >
      <template #avatar>
        <q-icon
          :name="$t('GroupsTabPanel.icon.warning')"
        />
      </template>
      {{ warningText }}
    </q-banner>
    <q-btn
      v-if="!isSuperAdmin"
      outline
      no-caps
      color="primary"
      class="bg-white q-mb-md"
      data-cy="button_attach_group"
      :label="$t('GroupsTabPanel.text.attach')"
      :icon="$t('GroupsTabPanel.icon.attach')"
      @click="openAttachDialog"
    />
    <groups-table
      v-model:filter-name="groupName"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
      v-model:total-elements="totalElements"
      :groups="groups"
      :show-action="false"
      :remove-action="false"
      :no-data-label="$t('GroupsTable.text.noData')"
      :no-data-icon="$t('GroupsTable.icon.noData')"
      @detach="(event) => isSuperAdmin ? false : openDetachDialog(event)"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import * as GroupService from 'src/services/GroupService';
import GroupsTable from 'components/tables/GroupsTable.vue';
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

const groups = ref([]);
const groupName = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);
let reloadGroupsEventRef;

const props = defineProps({
  entity: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  warningText: {
    type: String,
    default: '',
  },
});

/**
 * Open dialog to attach group to entity.
 * @returns {void} Nothing.
 */
function openAttachDialog() {
  if (props.type === 'ROLE') {
    return DialogEvent.next({
      key: 'attach-group-to-role',
      type: 'open',
      roleId: props.entity.id,
    });
  }

  if (props.type === 'USER') {
    return DialogEvent.next({
      key: 'attach-group-to-user',
      type: 'open',
      userLogin: props.entity.login,
    });
  }

  return DialogEvent.next({
    key: 'attach-group-to-group',
    type: 'open',
    groupId: props.entity.id,
  });
}

/**
 * Open dialog to remove group from entity.
 * @param {object} group - Group object to remove for the dialog.
 * @returns {void} Nothing.
 */
function openDetachDialog(group) {
  if (props.type === 'ROLE') {
    return DialogEvent.next({
      key: 'detach-group-from-role',
      type: 'open',
      role: props.entity,
      group,
    });
  }

  if (props.type === 'USER') {
    return DialogEvent.next({
      key: 'detach-group-from-user',
      type: 'open',
      user: props.entity,
      group,
    });
  }

  return DialogEvent.next({
    key: 'detach-group-from-group',
    type: 'open',
    groupToDetach: group,
    group: props.entity,
  });
}

/**
 * Load groups and invoke the appropriate method from GroupService based on the entity value.
 * @param {object} filters - API filters.
 * @returns {object} Object that contains group filters.
 */
async function loadGroups(filters) {
  if (props.type === 'ROLE') {
    return GroupService.findByRoleId(props.entity.id, filters);
  }

  if (props.type === 'USER') {
    return GroupService.findByLogin(props.entity.login, filters);
  }

  return GroupService.findSubGroups(props.entity.id, filters);
}

/**
 * Check if entity is valid.
 * @returns {boolean} True if it is valid otherwise false.
 */
function checkEntity() {
  if (props.type === 'USER') {
    return !!props.entity.login;
  }
  return !!props.entity.id;
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains group filters.
 */
function getFilters() {
  const filters = {};

  if (groupName.value?.length > 0 && props.type === 'GROUP') {
    filters.parentName = `lk_*${groupName.value}*`;
  }

  if (groupName.value?.length > 0 && props.type !== 'GROUP') {
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
 * Search and display groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  if (!checkEntity()) {
    return Promise.resolve();
  }

  loading.value = true;

  return loadGroups(getFilters()).then((data) => {
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

watch(() => props.entity, async () => {
  await search();
});

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
});
</script>
