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
      <users-tab-panel
        name="users"
        type="ROLE"
        :entity="role"
      />
      <access-control-tab-panel
        name="groups"
        access-control-type="group"
        type="ROLE"
        :entity="role"
        :is-super-admin="isSuperAdmin"
        :warning-text="$t('RolePage.text.addGroupMessage')"
      />
      <access-control-tab-panel
        name="roles"
        access-control-type="role"
        type="ROLE"
        :entity="role"
        :is-super-admin="isSuperAdmin"
        :warning-text="$t('RolePage.text.addRoleMessage')"
      />
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
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import * as PermissionService from 'src/services/PermissionService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import UsersTabPanel from 'components/tab-panel/UsersTabPanel.vue';
import AccessControlTabPanel from 'components/tab-panel/AccessControlTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const role = ref({});
const permissions = ref([]);
const currentTab = ref('users');
const isSuperAdmin = computed(() => role.value.name === process.env.SUPER_ADMINISTRATOR_ROLE_NAME);

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
    loadPermissions(),
  ])
    .finally(() => {
      loading.value = false;
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
  reloadPermissionsEventRef = ReloadPermissionsEvent.subscribe(loadPermissions);
  await search();
});

onUnmounted(() => {
  reloadPermissionsEventRef.unsubscribe();
});
</script>
