<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-item class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_user_go_back"
          :label="$t('UserPage.text.goBack')"
          :icon="$t('UserPage.icon.goBack')"
          @click="$router.push('/users')"
        />
      </q-item>
      <q-item>
        <q-item-section
          v-if="user.login"
          avatar
        >
          <user-avatar
            :login="user.login"
            color="white"
            size="100px"
            square
          />
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-h4"
            data-cy="page_user_title"
          >
            {{ user.name }}
          </q-item-label>
          <q-item-label
            v-if="user.email"
            class="text-h5"
            caption
          >
            {{ user.email }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="currentTab"
          no-caps
          active-color="primary"
          align="left"
        >
          <q-tab
            name="groups"
            :label="$t('UserPage.text.groupsTab')"
            data-cy="page_user_groups_tab"
          />
          <q-tab
            name="roles"
            :label="$t('UserPage.text.rolesTab')"
            data-cy="page_user_roles_tab"
          />
          <q-tab
            name="permissions"
            :label="$t('UserPage.text.permissionsTab')"
            data-cy="page_user_permissions_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_user_loading"
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
        name="groups"
        data-cy="page_user_groups_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_user_groups_title"
        >
          {{ $t('UserPage.text.groupList', { user: user.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_user_button_attach_group"
          :label="$t('UserPage.text.attachGroup')"
          :icon="$t('UserPage.icon.attach')"
          @click="openAttachGroupToUserDialog"
        />
        <groups-table
          :groups="groups"
          :show-action="false"
          :remove-action="false"
          @detach="openDetachGroupFromUserDialog"
        />
      </q-tab-panel>
      <roles-tab-panel
        name="roles"
        type="USER"
        :entity="user"
      />
      <q-tab-panel
        name="permissions"
        data-cy="page_user_permissions_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_user_permissions_title"
        >
          {{ $t('UserPage.text.permissionList', { user: user.name }) }}
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
import { onMounted, ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import * as GroupService from 'src/services/GroupService';
import * as PermissionService from 'src/services/PermissionService';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import UserAvatar from 'components/avatar/UserAvatar.vue';
import RolesTabPanel from 'components/tab-panel/RolesTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = ref({});
const groups = ref([]);
const permissions = ref([]);
const currentTab = ref('groups');

let reloadGroupsEventRef;

/**
 * Load user from login in url. If the user does not exist, redirect to the users page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUser() {
  return UserService.findByLogin(route.params.login)
    .then((data) => {
      user.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('UserPage.text.notFound'),
        html: true,
      });
      router.push('/users');
    });
}

/**
 * Get groups using user login.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroups() {
  return GroupService.findByLogin(route.params.login).then((data) => {
    groups.value = data.content;
  });
}

/**
 * Get roles using user login.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadPermissions() {
  return PermissionService.findByLogin(route.params.login).then((data) => {
    permissions.value = data.content;
  });
}

/**
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([
    loadUser(),
    loadGroups(),
    loadPermissions(),
  ])
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Open dialog to attach a group to user.
 */
function openAttachGroupToUserDialog() {
  DialogEvent.next({
    key: 'attach-group-to-user',
    type: 'open',
    userLogin: route.params.login,
  });
}

/**
 * Open dialog to remove user group.
 * @param {object} group - User group object to remove for the dialog.
 */
function openDetachGroupFromUserDialog(group) {
  DialogEvent.next({
    key: 'detach-group-from-user',
    type: 'open',
    group,
    user: user.value,
  });
}

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(loadGroups);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
});
</script>
