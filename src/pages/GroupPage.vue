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
            name="groups"
            :label="$t('GroupPage.text.groupsTab')"
            data-cy="page_group_groups_tab"
          />
          <q-tab
            name="roles"
            :label="$t('GroupPage.text.rolesTab')"
            data-cy="page_group_roles_tab"
          />
          <q-tab
            name="permissions"
            :label="$t('GroupPage.text.permissionsTab')"
            data-cy="page_group_permissions_tab"
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
      <users-tab-panel
        name="users"
        type="group"
        :entity="group"
      />
      <access-control-tab-panel
        name="groups"
        type="group"
        sub-type="group"
        :entity="group"
      />
      <access-control-tab-panel
        name="roles"
        type="role"
        sub-type="group"
        :entity="group"
      />
      <q-tab-panel
        name="permissions"
        data-cy="page_group_permissions_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_group_permissions_title"
        >
          {{ $t('GroupPage.text.permissionList', { group: group.name }) }}
        </h6>
        <permissions-table
          :permissions="permissions"
          :show-action="false"
          :remove-action="false"
          :detach-action="false"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as GroupService from 'src/services/GroupService';
import * as PermissionService from 'src/services/PermissionService';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import UsersTabPanel from 'components/tab-panel/UsersTabPanel.vue';
import AccessControlTabPanel from 'components/tab-panel/AccessControlTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const group = ref({});
const permissions = ref([]);
const currentTab = ref('users');

let reloadPermissionsEventRef;

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
 * Get permissions using group Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadPermissions() {
  return PermissionService.findByGroupId(route.params.id).then((data) => {
    permissions.value = data.content;
  });
}

/**
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([
    loadGroup(),
    loadPermissions(),
  ])
    .finally(() => {
      loading.value = false;
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
