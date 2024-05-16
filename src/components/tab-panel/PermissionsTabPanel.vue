<template>
  <q-tab-panel
    name="permissions"
    data-cy="permissions_tab_panel"
  >
    <h6
      class="q-ma-none q-mb-sm"
      data-cy="permissions_title"
    >
      {{ $t('PermissionsTabPanel.text.title', { name: entity.name }) }}
    </h6>
    <q-banner
      v-if="isSuperAdmin"
      dense
      class="bg-warning text-white text-weight-bold q-mb-md"
      :data-cy="`tab_${type}_warning`"
    >
      <template #avatar>
        <q-icon
          :name="$t('PermissionsTabPanel.icon.warning')"
        />
      </template>
      {{ warningText }}
    </q-banner>
    <q-btn
      v-if="showAttachDetachButton"
      outline
      no-caps
      color="primary"
      class="bg-white q-mb-md"
      data-cy="button_attach_permission"
      :label="$t('PermissionsTabPanel.text.attach')"
      :icon="$t('PermissionsTabPanel.icon.attach')"
      @click="openAttachDialog"
    />
    <permissions-table
      v-model:filter-entity="filters.entity"
      v-model:filter-action="filters.action"
      v-model:filter-library-id="filters.libraryId"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
      v-model:total-elements="totalElements"
      :permissions="permissions"
      :show-action="false"
      :remove-action="false"
      :detach-action="showAttachDetachButton"
      :no-data-label="$t('PermissionsTable.text.noData')"
      :no-data-icon="$t('PermissionsTable.icon.noData')"
      @detach="(event) => isSuperAdmin ? false : openDetachDialog(event)"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import * as PermissionService from 'src/services/PermissionService';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import DialogEvent from 'src/composables/events/DialogEvent';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';
import StringFilter from 'src/composables/filters/StringFilter';
import Filter from 'src/composables/filters/Filter';

const emits = defineEmits([
  'update:permissions-query',
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
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  warningText: {
    type: String,
    default: '',
  },
});

const route = useRoute();
const permissions = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const showAttachDetachButton = computed(() => !props.isSuperAdmin && props.type === 'role');
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter([
  new PageFilter(),
  new CountFilter(),
  new Filter('entity', 'entity', 'entity', ''),
  new StringFilter('action', 'action', 'action'),
  new StringFilter('libraryId', 'libraryId', 'libraryId'),
]);

let reloadPermissionsEventRef;

/**
 * Open dialog to attach a permission to role.
 * @returns {void} Nothing.
 */
function openAttachDialog() {
  return DialogEvent.next({
    key: 'attach-permission-to-role',
    type: 'open',
    roleId: props.entity.id,
  });
}

/**
 * Open dialog to detach a permission from role.
 * @param {object} permission - Permission object to remove for the dialog.
 * @returns {void} Nothing.
 */
function openDetachDialog(permission) {
  return DialogEvent.next({
    key: 'detach-permission-from-role',
    type: 'open',
    permission,
    role: props.entity,
  });
}

/**
 * Load permissions and invoke the appropriate method from PermissionService.
 * @param {object} apiFilters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadPermissions(apiFilters) {
  if (props.type === 'role') {
    return PermissionService.findByRoleId(props.entity.id, apiFilters);
  }

  if (props.type === 'user') {
    return PermissionService.findByLogin(props.entity.login, apiFilters);
  }

  return PermissionService.findByGroupId(props.entity.id, apiFilters);
}

/**
 * Check if entity is valid.
 * @returns {boolean} True if it is valid otherwise false.
 */
function checkEntity() {
  if (props.type === 'user') {
    return !!props.entity.login;
  }
  return !!props.entity.id;
}

/**
 * Search and display permissions.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  if (!checkEntity()) {
    return Promise.resolve();
  }

  loading.value = true;

  return loadPermissions(getFilters()).then((data) => {
    permissions.value = data.content;
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
    emits('update:permissions-query', generateQuery());
  });
}

watch(() => props.entity, async () => {
  await search();
});

onMounted(async () => {
  init(route.query);
  reloadPermissionsEventRef = ReloadPermissionsEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadPermissionsEventRef.unsubscribe();
});
</script>
