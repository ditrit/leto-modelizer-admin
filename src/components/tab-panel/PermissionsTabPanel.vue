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
      v-model:filter-entity="entityName"
      v-model:filter-action="actionName"
      v-model:filter-library-id="libraryId"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
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
const entityName = ref('');
const actionName = ref('');
const libraryId = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);
const showAttachDetachButton = computed(() => !props.isSuperAdmin && props.type === 'role');

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
 * @param {object} filters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadPermissions(filters) {
  if (props.type === 'role') {
    return PermissionService.findByRoleId(props.entity.id, filters);
  }

  if (props.type === 'user') {
    return PermissionService.findByLogin(props.entity.login, filters);
  }

  return PermissionService.findByGroupId(props.entity.id, filters);
}

/**
 * Emit query parameters built with filters and pagination values.
 */
function emitQuery() {
  const queryParameters = {};

  if (elementsPerPage.value !== 10) {
    queryParameters.size = elementsPerPage.value;
  }

  if (currentPage.value > 1) {
    queryParameters.page = currentPage.value;
  }

  if (entityName.value?.length > 0) {
    queryParameters.entity = entityName.value;
  }

  if (actionName.value?.length > 0) {
    queryParameters.action = actionName.value;
  }

  if (libraryId.value?.length > 0) {
    queryParameters.libraryId = libraryId.value;
  }

  emits('update:permissions-query', queryParameters);
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

  if (query.entity) {
    entityName.value = query.entity;
  }

  if (query.action) {
    actionName.value = query.action;
  }

  if (query.libraryId) {
    libraryId.value = query.libraryId;
  }
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains user filters.
 */
function getFilters() {
  const filters = {};

  if (entityName.value?.length > 0) {
    filters.entity = entityName.value;
  }

  if (actionName.value?.length > 0) {
    filters.action = actionName.value;
  }

  if (libraryId.value?.length > 0) {
    filters.libraryId = libraryId.value;
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
    currentPage.value = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    elementsPerPage.value = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
    emitQuery();
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
