<template>
  <q-tab-panel
    name="roles"
    data-cy="roles_tab_panel"
  >
    <h6
      class="q-ma-none q-mb-sm"
      data-cy="roles_title"
    >
      {{ $t('RolesTabPanel.text.title', { name: entity.name }) }}
    </h6>
    <q-banner
      v-if="isSuperAdmin"
      dense
      class="bg-warning text-white text-weight-bold q-mb-md"
      data-cy="tab_role_warning"
    >
      <template #avatar>
        <q-icon
          :name="$t('RolesTabPanel.icon.warning')"
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
      data-cy="button_attach_role"
      :label="$t('RolesTabPanel.text.attach')"
      :icon="$t('RolesTabPanel.icon.attach')"
      @click="openAttachDialog"
    />
    <roles-table
      v-model:filter-name="roleName"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
      v-model:total-elements="totalElements"
      :roles="roles"
      :show-action="false"
      :remove-action="false"
      :no-data-label="$t('RolesTable.text.noData')"
      :no-data-icon="$t('RolesTable.icon.noData')"
      @detach="(event) => isSuperAdmin ? false : openDetachDialog(event)"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import * as RoleService from 'src/services/RoleService';
import RolesTable from 'components/tables/RolesTable.vue';
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

const roles = ref([]);
const roleName = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);
let reloadRolesEventRef;

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
 * Open dialog to attach role to entity.
 * @returns {void} Nothing.
 */
function openAttachDialog() {
  if (props.type === 'ROLE') {
    return DialogEvent.next({
      key: 'attach-role-to-role',
      type: 'open',
      roleId: props.entity.id,
    });
  }

  if (props.type === 'USER') {
    return DialogEvent.next({
      key: 'attach-role-to-user',
      type: 'open',
      userLogin: props.entity.login,
    });
  }

  return DialogEvent.next({
    key: 'attach-role-to-group',
    type: 'open',
    groupId: props.entity.id,
  });
}

/**
 * Open dialog to remove role from entity.
 * @param {object} role - Role object to remove for the dialog.
 * @returns {void} Nothing.
 */
function openDetachDialog(role) {
  if (props.type === 'ROLE') {
    return DialogEvent.next({
      key: 'detach-role-from-role',
      type: 'open',
      roleToDetach: role,
      role: props.entity,
    });
  }

  if (props.type === 'USER') {
    return DialogEvent.next({
      key: 'detach-role-from-user',
      type: 'open',
      user: props.entity,
      role,
    });
  }

  return DialogEvent.next({
    key: 'detach-role-from-group',
    type: 'open',
    group: props.entity,
    role,
  });
}

/**
 * Load roles and invoke the appropriate method from RoleService based on the entity value.
 * @param {object} filters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadRoles(filters) {
  if (props.type === 'ROLE') {
    return RoleService.findSubRoles(props.entity.id, filters);
  }

  if (props.type === 'USER') {
    return RoleService.findByLogin(props.entity.login, filters);
  }

  return RoleService.findByGroupId(props.entity.id, filters);
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
 * @returns {object} Object that contains role filters.
 */
function getFilters() {
  const filters = {};

  if (roleName.value?.length > 0 && props.type === 'ROLE') {
    filters.parentName = `lk_*${roleName.value}*`;
  }

  if (roleName.value?.length > 0 && props.type !== 'ROLE') {
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
  if (!checkEntity()) {
    return Promise.resolve();
  }

  loading.value = true;

  return loadRoles(getFilters()).then((data) => {
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

watch(() => props.entity, async () => {
  await search();
});

onMounted(async () => {
  reloadRolesEventRef = ReloadRolesEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadRolesEventRef.unsubscribe();
});
</script>
