<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_group_go_back"
          :label="$t('GroupPage.text.goBack')"
          :icon="$t('GroupPage.icon.goBack')"
          @click="$router.push('/groups')"
        />
      </q-card-section>
      <q-card-section class="q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_group_title"
        >
          {{ group.name }}
        </h4>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="currentTab"
          no-caps
          active-color="primary"
          align="left"
        >
          <q-tab
            name="users"
            :label="$t('GroupPage.text.usersTab')"
            data-cy="page_group_users_tab"
          />
          <q-tab
            name="roles"
            :label="$t('GroupPage.text.rolesTab')"
            data-cy="page_group_roles_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_group_loading"
      />
    </q-card>
    <q-tab-panels
      v-model="currentTab"
      animated
      transition-prev="jump-up"
      transition-next="jump-down"
      class="bg-grey-1"
    >
      <q-tab-panel
        name="users"
        data-cy="page_group_users_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_group_users_title"
        >
          {{ $t('GroupPage.text.userList', { group: group.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_group_button_attach_user"
          :label="$t('GroupPage.text.attachUser')"
          :icon="$t('GroupPage.icon.attachUser')"
          @click="openAttachUserToGroupDialog"
        />
        <users-table
          :users="users"
          :show-action="false"
          :remove-action="false"
          @detach="openDetachUserFromGroupDialog"
        />
      </q-tab-panel>
      <q-tab-panel
        name="roles"
        data-cy="page_group_roles_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_group_roles_title"
        >
          {{ $t('GroupPage.text.roleList', { group: group.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_group_button_attach_role"
          :label="$t('GroupPage.text.attachRole')"
          :icon="$t('GroupPage.icon.attachRole')"
          @click="openAttachRoleToGroupDialog"
        />
        <roles-table
          :roles="roles"
          :show-action="false"
          :remove-action="false"
          @detach="openDetachRoleFromGroupDialog"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import UsersTable from 'src/components/tables/UsersTable.vue';
import RolesTable from 'src/components/tables/RolesTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const group = ref({});
const users = ref([]);
const roles = ref([]);
const currentTab = ref('users');

let reloadUsersEventRef;
let reloadRolesEventRef;

/**
 * Load group from id in url. If the group does not exist, redirect to the libraries page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroup() {
  return GroupService.findById(route.params.id)
    .then((data) => {
      group.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('GroupPage.text.notFound'),
        html: true,
      });
      router.push('/groups');
    });
}

/**
 * Get users using group Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUsers() {
  return UserService.findByGroupId(route.params.id).then((data) => {
    users.value = data.content;
  });
}

/**
 * Get roles using group Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadRoles() {
  return RoleService.findByGroupId(route.params.id).then((data) => {
    roles.value = data.content;
  });
}

/**
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([
    loadGroup(),
    loadUsers(),
    loadRoles(),
  ])
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Open dialog to attach a user to a group.
 */
function openAttachUserToGroupDialog() {
  DialogEvent.next({
    key: 'attach-user-to-group',
    type: 'open',
    groupId: route.params.id,
  });
}

/**
 * Open dialog to attach a role to a group.
 */
function openAttachRoleToGroupDialog() {
  DialogEvent.next({
    key: 'attach-role-to-group',
    type: 'open',
    groupId: route.params.id,
  });
}

/**
 * Open dialog to detach a user from a group.
 * @param {object} user - User object to remove for the dialog.
 */
function openDetachUserFromGroupDialog(user) {
  DialogEvent.next({
    key: 'detach-user-from-group',
    type: 'open',
    group: group.value,
    user,
  });
}

/**
 * Open dialog to detach a role from a group.
 * @param {object} role - Role object to remove for the dialog.
 */
function openDetachRoleFromGroupDialog(role) {
  DialogEvent.next({
    key: 'detach-role-from-group',
    type: 'open',
    group: group.value,
    role,
  });
}

onMounted(async () => {
  reloadUsersEventRef = ReloadUsersEvent.subscribe(loadUsers);
  reloadRolesEventRef = ReloadRolesEvent.subscribe(loadRoles);
  await search();
});

onUnmounted(() => {
  reloadUsersEventRef.unsubscribe();
  reloadRolesEventRef.unsubscribe();
});
</script>
