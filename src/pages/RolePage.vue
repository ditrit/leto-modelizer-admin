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
        type="role"
        :entity="role"
      />
      <access-control-tab-panel
        name="groups"
        type="group"
        sub-type="role"
        :entity="role"
        :is-super-admin="isSuperAdmin"
        :warning-text="$t('RolePage.text.addGroupMessage')"
      />
      <access-control-tab-panel
        name="roles"
        type="role"
        sub-type="role"
        :entity="role"
        :is-super-admin="isSuperAdmin"
        :warning-text="$t('RolePage.text.addRoleMessage')"
      />
      <permissions-tab-panel
        name="permissions"
        type="role"
        :entity="role"
        :is-super-admin="isSuperAdmin"
        :warning-text="$t('RolePage.text.addPermissionMessage')"
      />
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as RoleService from 'src/services/RoleService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import UsersTabPanel from 'components/tab-panel/UsersTabPanel.vue';
import AccessControlTabPanel from 'components/tab-panel/AccessControlTabPanel.vue';
import PermissionsTabPanel from 'components/tab-panel/PermissionsTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const role = ref({});
const currentTab = ref('users');
const isSuperAdmin = computed(() => role.value.name === process.env.SUPER_ADMINISTRATOR_ROLE_NAME);

/**
 * Load role from id in url. If the role does not exist, redirect to the roles page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadRole() {
  loading.value = true;

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
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(async () => {
  await loadRole();
});
</script>
