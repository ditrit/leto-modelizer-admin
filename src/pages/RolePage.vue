<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_role_go_back"
          :label="$t('RolePage.text.goBack')"
          :icon="$t('RolePage.icon.goBack')"
          @click="$router.push('/roles')"
        />
      </q-card-section>
      <q-card-section class="q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_role_title"
        >
          {{ role.name }}
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
            :label="$t('RolePage.text.usersTab')"
            data-cy="page_role_users_tab"
          />
          <q-tab
            name="groups"
            :label="$t('RolePage.text.groupsTab')"
            data-cy="page_role_groups_tab"
          />
          <q-tab
            name="roles"
            :label="$t('RolePage.text.rolesTab')"
            data-cy="page_role_roles_tab"
          />
          <q-tab
            name="permissions"
            :label="$t('RolePage.text.permissionsTab')"
            data-cy="page_role_permissions_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_role_loading"
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
        data-cy="page_role_users_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_role_users_title"
        >
          {{ $t('RolePage.text.userList', { role: role.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_role_button_attach_user"
          :label="$t('RolePage.text.attachUser')"
          :icon="$t('RolePage.icon.attach')"
          @click="openAttachUserToRoleDialog"
        />
        <users-table
          :users="users"
          :show-action="false"
          :remove-action="false"
          :no-data-label="$t('UsersTable.text.noData')"
          :no-data-icon="$t('UsersTable.icon.noData')"
          @detach="openDetachUserFromRoleDialog"
        />
      </q-tab-panel>
      <q-tab-panel
        name="groups"
        data-cy="page_role_groups_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_role_groups_title"
        >
          {{ $t('RolePage.text.groupList', { role: role.name }) }}
        </h6>
        <q-banner
          v-if="isSuperAdmin"
          dense
          class="bg-warning text-white text-weight-bold q-mb-md"
          data-cy="page_role_groups_warning"
        >
          <template #avatar>
            <q-icon
              :name="$t('RolePage.icon.warning')"
            />
          </template>
          {{ $t("RolePage.text.addGroupMessage") }}
        </q-banner>
        <q-btn
          v-if="!isSuperAdmin"
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_role_button_attach_group"
          :label="$t('RolePage.text.attachGroup')"
          :icon="$t('RolePage.icon.attach')"
          @click="openAttachGroupToRoleDialog"
        />
        <groups-table
          :groups="groups"
          :show-action="false"
          :remove-action="false"
          :detach-action="!isSuperAdmin"
          @detach="(event) => isSuperAdmin ? false : openDetachGroupFromRoleDialog(event)"
        />
      </q-tab-panel>
      <q-tab-panel
        name="roles"
        data-cy="page_role_roles_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_role_roles_title"
        >
          {{ $t('RolePage.text.roleList', { role: role.name }) }}
        </h6>
        <q-banner
          v-if="isSuperAdmin"
          dense
          class="bg-warning text-white text-weight-bold q-mb-md"
          data-cy="page_role_roles_warning"
        >
          <template #avatar>
            <q-icon
              :name="$t('RolePage.icon.warning')"
            />
          </template>
          {{ $t("RolePage.text.addRoleMessage") }}
        </q-banner>
        <q-btn
          v-if="!isSuperAdmin"
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_role_button_attach_role"
          :label="$t('RolePage.text.attachRole')"
          :icon="$t('RolePage.icon.attach')"
          @click="openAttachRoleToRoleDialog"
        />
        <roles-table
          :roles="roles"
          :show-action="false"
          :remove-action="false"
          :detach-action="!isSuperAdmin"
          :no-data-label="$t('RolesTable.text.noData')"
          :no-data-icon="$t('RolesTable.icon.noData')"
          @detach="(event) => isSuperAdmin ? false : openDetachRoleFromRoleDialog(event)"
        />
      </q-tab-panel>
      <q-tab-panel
        name="permissions"
        data-cy="page_role_permissions_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_role_permissions_title"
        >
          {{ $t('RolePage.text.permissionList', { role: role.name }) }}
        </h6>
        <q-banner
          v-if="isSuperAdmin"
          dense
          class="bg-warning text-white text-weight-bold q-mb-md"
          data-cy="page_role_permission_warning"
        >
          <template #avatar>
            <q-icon
              :name="$t('RolePage.icon.warning')"
            />
          </template>
          {{ $t("RolePage.text.addPermissionMessage") }}
        </q-banner>
        <q-btn
          v-if="!isSuperAdmin"
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_role_button_attach_permission"
          :label="$t('RolePage.text.attachPermission')"
          :icon="$t('RolePage.icon.attach')"
          @click="openAttachPermissionToRoleDialog"
        />
        <permissions-table
          :permissions="permissions"
          :show-action="false"
          :remove-action="false"
          :detach-action="!isSuperAdmin"
          @detach="(event) => isSuperAdmin ? false : openDetachPermissionFromRoleDialog(event)"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as RoleService from 'src/services/RoleService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import UsersTable from 'src/components/tables/UsersTable.vue';
import RolesTable from 'src/components/tables/RolesTable.vue';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import * as PermissionService from 'src/services/PermissionService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const role = ref({});
const users = ref([]);
const groups = ref([]);
const roles = ref([]);
const permissions = ref([]);
const currentTab = ref('users');
const isSuperAdmin = computed(() => role.value.name === process.env.SUPER_ADMINISTRATOR_ROLE_NAME);

let reloadUsersEventRef;
let reloadGroupsEventRef;
let reloadRolesEventRef;
let reloadPermissionsEventRef;

/**
 * Load role from id in url. If the role does not exist, redirect to the roles page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadRole() {
  return RoleService.findById(route.params.id)
    .then((data) => {
      role.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('RolePage.text.notFound'),
        html: true,
      });
      router.push('/roles');
    });
}

/**
 * Get all groups of a role by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroups() {
  return GroupService.findByRoleId(route.params.id).then((data) => {
    groups.value = data.content;
  });
}

/**
 * Get all users of a role by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUsers() {
  return UserService.findByRoleId(route.params.id).then((data) => {
    users.value = data.content;
  });
}

/**
 * Get all sub roles of a role by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadRoles() {
  return RoleService.findSubRoles(route.params.id).then((data) => {
    roles.value = data.content;
  });
}

/**
 * Get all permissions of a role by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadPermissions() {
  return PermissionService.findByRoleId(route.params.id).then((data) => {
    permissions.value = data.content;
  });
}

/**
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([
    loadRole(),
    loadGroups(),
    loadUsers(),
    loadRoles(),
    loadPermissions(),
  ])
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Open dialog to attach a user to role.
 */
function openAttachUserToRoleDialog() {
  DialogEvent.next({
    key: 'attach-user-to-role',
    type: 'open',
    roleId: route.params.id,
  });
}

/**
 * Open dialog to attach a group to role.
 */
function openAttachGroupToRoleDialog() {
  DialogEvent.next({
    key: 'attach-group-to-role',
    type: 'open',
    roleId: route.params.id,
  });
}

/**
 * Open dialog to attach a role to role.
 */
function openAttachRoleToRoleDialog() {
  DialogEvent.next({
    key: 'attach-role-to-role',
    type: 'open',
    roleId: route.params.id,
  });
}

/**
 * Open dialog to attach a permission to role.
 */
function openAttachPermissionToRoleDialog() {
  DialogEvent.next({
    key: 'attach-permission-to-role',
    type: 'open',
    roleId: route.params.id,
  });
}

/**
 * Open dialog to remove role user.
 * @param {object} user - User object to remove for the dialog.
 */
function openDetachUserFromRoleDialog(user) {
  DialogEvent.next({
    key: 'detach-user-from-role',
    type: 'open',
    user,
    role: role.value,
  });
}

/**
 * Open dialog to remove role group.
 * @param {object} group - Group object to remove for the dialog.
 */
function openDetachGroupFromRoleDialog(group) {
  DialogEvent.next({
    key: 'detach-group-from-role',
    type: 'open',
    group,
    role: role.value,
  });
}

/**
 * Open dialog to remove role from role.
 * @param {object} roleToDetach - Role object to remove for the dialog.
 */
function openDetachRoleFromRoleDialog(roleToDetach) {
  DialogEvent.next({
    key: 'detach-role-from-role',
    type: 'open',
    roleToDetach,
    role: role.value,
  });
}

/**
 * Open dialog to remove role permission.
 * @param {object} permission - Permission object to remove for the dialog.
 */
function openDetachPermissionFromRoleDialog(permission) {
  DialogEvent.next({
    key: 'detach-permission-from-role',
    type: 'open',
    permission,
    role: role.value,
  });
}

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(loadGroups);
  reloadUsersEventRef = ReloadUsersEvent.subscribe(loadUsers);
  reloadRolesEventRef = ReloadRolesEvent.subscribe(loadRoles);
  reloadPermissionsEventRef = ReloadPermissionsEvent.subscribe(loadPermissions);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
  reloadUsersEventRef.unsubscribe();
  reloadRolesEventRef.unsubscribe();
  reloadPermissionsEventRef.unsubscribe();
});
</script>
