<template>
  <q-tab-panel
    :name="`${type}s`"
    :data-cy="`${type}s_tab_panel`"
  >
    <h6
      class="q-ma-none q-mb-sm"
      :data-cy="`${type}s_title`"
    >
      {{ $t(`${translationKey}sTabPanel.text.title`, { name: entity.name }) }}
    </h6>
    <q-banner
      v-if="isSuperAdmin"
      dense
      class="bg-warning text-white text-weight-bold q-mb-md"
      :data-cy="`tab_${type}_warning`"
    >
      <template #avatar>
        <q-icon
          :name="$t(`${translationKey}sTabPanel.icon.warning`)"
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
      :data-cy="`button_attach_${type}`"
      :label="$t(`${translationKey}sTabPanel.text.attach`)"
      :icon="$t(`${translationKey}sTabPanel.icon.attach`)"
      @click="openAttachDialog"
    />
    <access-control-table
      v-model:filter-name="filters.name"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
      v-model:total-elements="totalElements"
      :access-control-type="type"
      :rows="rows"
      :show-action="false"
      :remove-action="false"
      :no-data-label="$t(`${translationKey}sTable.text.noData`)"
      :no-data-icon="$t(`${translationKey}sTable.icon.noData`)"
      @detach="(event) => isSuperAdmin ? false : openDetachDialog(event)"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import AccessControlTable from 'components/tables/AccessControlTable.vue';
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import DialogEvent from 'src/composables/events/DialogEvent';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
// import { getAccessControlFilters } from 'src/composables/FiltersArray';
import { accessControlFilters } from 'src/composables/FiltersArray';

const emits = defineEmits([
  'update:access-control-query',
]);

const props = defineProps({
  entity: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subType: {
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

const rows = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const route = useRoute();
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter(accessControlFilters);
// } = useServerSideFilter(getAccessControlFilters(props.subType));
const translationKey = computed(() => (props.type === 'role' ? 'Role' : 'Group'));

let reloadGroupsEventRef;
let reloadRolesEventRef;

/**
 * Open dialog to attach a role or group to an entity depending on props sub type.
 * @returns {void} Nothing.
 */
function openAttachDialog() {
  if (props.subType === 'user') {
    return DialogEvent.next({
      key: `attach-${props.type}-to-user`,
      type: 'open',
      userLogin: props.entity.login,
    });
  }

  return DialogEvent.next({
    key: 'attach-access-control',
    type: 'open',
    accessControl: props.entity,
    accessControlType: props.type,
    targetAccessControlType: props.subType,
  });
}

/**
 * Open dialog to remove a role or group from an entity.
 * @param {object} accessControlToDetach - The role or group object to remove for the dialog.
 * @returns {void} Nothing.
 */
function openDetachDialog(accessControlToDetach) {
  if (props.subType === 'user') {
    return DialogEvent.next({
      key: `detach-${props.type}-from-user`,
      type: 'open',
      user: props.entity,
      role: accessControlToDetach,
      group: accessControlToDetach,
    });
  }

  return DialogEvent.next({
    key: 'detach-access-control',
    type: 'open',
    accessControl: props.entity,
    targetAccessControl: accessControlToDetach,
    accessControlType: props.type,
    targetAccessControlType: props.subType,
  });
}

/**
 * Load groups and invoke the appropriate method from GroupService based on the entity value.
 * @param {object} apiFilters - API filters.
 * @returns {object} Object that contains group filters.
 */
async function loadGroups(apiFilters) {
  if (props.subType === 'role') {
    return GroupService.findByRoleId(props.entity.id, apiFilters);
  }

  if (props.subType === 'user') {
    return GroupService.findByLogin(props.entity.login, apiFilters);
  }

  return GroupService.findSubGroups(props.entity.id, apiFilters);
}

/**
 * Load roles and invoke the appropriate method from RoleService based on the entity value.
 * @param {object} apiFilters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadRoles(apiFilters) {
  if (props.subType === 'role') {
    return RoleService.findSubRoles(props.entity.id, apiFilters);
  }

  if (props.subType === 'user') {
    return RoleService.findByLogin(props.entity.login, apiFilters);
  }

  return RoleService.findByGroupId(props.entity.id, apiFilters);
}

/**
 * Check if entity is valid.
 * @returns {boolean} True if it is valid otherwise false.
 */
function checkEntity() {
  if (props.subType === 'user') {
    return !!props.entity.login;
  }
  return !!props.entity.id;
}

/**
 * Search and display access controls.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  if (!checkEntity()) {
    return Promise.resolve();
  }

  loading.value = true;

  const promise = props.type === 'group' ? loadGroups : loadRoles;
  const hasParentAccessControl = ['group', 'role'].includes(props.subType);

  return promise(getFilters(hasParentAccessControl)).then((data) => {
    rows.value = data.content;
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
    emits('update:access-control-query', generateQuery());
  });
}

watch(() => props.entity, async () => {
  await search();
});

onMounted(async () => {
  init(route.query);
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(search);
  reloadRolesEventRef = ReloadRolesEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
  reloadRolesEventRef.unsubscribe();
});
</script>
