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
      v-model:filter-name="filters.name"
      v-model:filter-login="filters.login"
      v-model:filter-email="filters.email"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
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
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import { userFilters } from 'src/composables/FiltersArray';

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
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter(userFilters);

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
 * @param {object} apiFilters - API filters.
 * @returns {object} Object that contains role filters.
 */
async function loadUsers(apiFilters) {
  if (props.type === 'role') {
    return UserService.findByRoleId(props.entity.id, apiFilters);
  }

  return UserService.findByGroupId(props.entity.id, apiFilters);
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
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
    emits('update:users-query', generateQuery());
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
