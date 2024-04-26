<template>
  <q-tab-panel
    name="users"
    data-cy="users_tab_panel"
  >
    <h6
      class="q-ma-none q-mb-sm"
      data-cy="users_title"
    >
      {{ $t('UsersTabPanel.text.title', { name: entity.name }) }}
    </h6>
    <q-btn
      outline
      no-caps
      color="primary"
      class="bg-white q-mb-md"
      data-cy="button_attach_user"
      :label="$t('UsersTabPanel.text.attach')"
      :icon="$t('UsersTabPanel.icon.attach')"
      @click="openAttachDialog"
    />
    <users-table
      v-model:filter-name="userName"
      v-model:filter-login="userLogin"
      v-model:filter-email="userEmail"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      v-model:elements-per-page="elementsPerPage"
      v-model:total-elements="totalElements"
      :users="users"
      :show-action="false"
      :remove-action="false"
      :no-data-label="$t('UsersTable.text.noData')"
      :no-data-icon="$t('UsersTable.icon.noData')"
      @detach="openDetachDialog"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import * as UserService from 'src/services/UserService';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import DialogEvent from 'src/composables/events/DialogEvent';
import UsersTable from 'src/components/tables/UsersTable.vue';

const emits = defineEmits([
  'update:users-query',
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
});

const route = useRoute();
const users = ref([]);
const userName = ref('');
const userLogin = ref('');
const userEmail = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);
const loading = ref(false);

let reloadUsersEventRef;

/**
 * Open dialog to attach a user to entity.
 * @returns {void} Nothing.
 */
function openAttachDialog() {
  if (props.type === 'role') {
    return DialogEvent.next({
      key: 'attach-user-to-role',
      type: 'open',
      roleId: props.entity.id,
    });
  }

  return DialogEvent.next({
    key: 'attach-user-to-group',
    type: 'open',
    groupId: props.entity.id,
  });
}

/**
 * Open dialog to detach a user from entity.
 * @param {object} user - User object to remove for the dialog.
 * @returns {void} Nothing.
 */
function openDetachDialog(user) {
  if (props.type === 'role') {
    return DialogEvent.next({
      key: 'detach-user-from-role',
      type: 'open',
      user,
      role: props.entity,
    });
  }

  return DialogEvent.next({
    key: 'detach-user-from-group',
    type: 'open',
    user,
    group: props.entity,
  });
}

/**
 * Load users and invoke the appropriate method from UserService based on the entity value.
 * @param {object} filters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadUsers(filters) {
  if (props.type === 'role') {
    return UserService.findByRoleId(props.entity.id, filters);
  }

  return UserService.findByGroupId(props.entity.id, filters);
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

  if (userName.value?.length > 0) {
    queryParameters.name = userName.value;
  }

  if (userLogin.value?.length > 0) {
    queryParameters.login = userLogin.value;
  }

  if (userEmail.value?.length > 0) {
    queryParameters.email = userEmail.value;
  }

  emits('update:users-query', queryParameters);
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
    userName.value = query.name;
  }

  if (query.login) {
    userLogin.value = query.login;
  }

  if (query.email) {
    userEmail.value = query.email;
  }
}

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains user filters.
 */
function getFilters() {
  const filters = {};

  if (userName.value?.length > 0) {
    filters.name = `lk_*${userName.value}*`;
  }

  if (userLogin.value?.length > 0) {
    filters.login = `lk_*${userLogin.value}*`;
  }

  if (userEmail.value?.length > 0) {
    filters.email = `lk_*${userEmail.value}*`;
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
 * Search and display users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  if (!props.entity || !props.entity.id) {
    return Promise.resolve();
  }

  loading.value = true;

  return loadUsers(getFilters()).then((data) => {
    users.value = data.content;
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
  reloadUsersEventRef = ReloadUsersEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadUsersEventRef.unsubscribe();
});
</script>
