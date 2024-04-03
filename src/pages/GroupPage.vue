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
        type="GROUP"
        :entity="group"
      />
      <q-tab-panel
        name="groups"
        data-cy="page_group_groups_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_group_groups_title"
        >
          {{ $t('GroupPage.text.groupList', { group: group.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_group_button_attach_group"
          :label="$t('GroupPage.text.attachGroup')"
          :icon="$t('GroupPage.icon.attach')"
          @click="openAttachGroupToGroupDialog"
        />
        <groups-table
          :groups="groups"
          :show-action="false"
          :remove-action="false"
          @detach="openDetachGroupFromGroupDialog"
        />
      </q-tab-panel>
      <roles-tab-panel
        name="roles"
        type="GROUP"
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
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import RolesTabPanel from 'components/tab-panel/RolesTabPanel.vue';
import UsersTabPanel from 'components/tab-panel/UsersTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const group = ref({});
const groups = ref([]);
const permissions = ref([]);
const currentTab = ref('users');

let reloadGroupsEventRef;
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
 * Get groups using group Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroups() {
  return GroupService.findSubGroups(route.params.id).then((data) => {
    groups.value = data.content;
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
    loadGroups(),
    loadPermissions(),
  ])
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Open dialog to attach a group to a group.
 */
function openAttachGroupToGroupDialog() {
  DialogEvent.next({
    key: 'attach-group-to-group',
    type: 'open',
    groupId: route.params.id,
  });
}

/**
 * Open dialog to detach a group from a group.
 * @param {object} grouptoDetach - Group object to remove for the dialog.
 */
function openDetachGroupFromGroupDialog(grouptoDetach) {
  DialogEvent.next({
    key: 'detach-group-from-group',
    type: 'open',
    group: group.value,
    grouptoDetach,
  });
}

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(loadGroups);
  reloadPermissionsEventRef = ReloadPermissionsEvent.subscribe(loadPermissions);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
  reloadPermissionsEventRef.unsubscribe();
});
</script>
