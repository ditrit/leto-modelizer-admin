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
      <q-tab-panel
        name="roles"
        data-cy="page_user_roles_tab_panel"
      >
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_user_roles_title"
        >
          {{ $t('UserPage.text.roleList', { user: user.name }) }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_user_button_attach_role"
          :label="$t('UserPage.text.attachRole')"
          :icon="$t('UserPage.icon.attach')"
          @click="openAttachRoleToUserDialog"
        />
        <roles-table
          :roles="roles"
          :show-action="false"
          :remove-action="false"
          :no-data-label="$t('RolesTable.text.noData')"
          :no-data-icon="$t('RolesTable.icon.noData')"
          @detach="openDetachRoleFromUserDialog"
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
import RolesTable from 'src/components/tables/RolesTable.vue';
import * as RoleService from 'src/services/RoleService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import UserAvatar from 'components/avatar/UserAvatar.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = ref({});
const groups = ref([]);
const roles = ref([]);
const currentTab = ref('groups');

let reloadGroupsEventRef;
let reloadRolesEventRef;

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
async function loadRoles() {
  return RoleService.findByLogin(route.params.login).then((data) => {
    roles.value = data.content;
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
    loadRoles(),
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
 * Open dialog to attach a role to user.
 */
function openAttachRoleToUserDialog() {
  DialogEvent.next({
    key: 'attach-role-to-user',
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

/**
 * Open dialog to remove user role.
 * @param {object} role - User role object to remove for the dialog.
 */
function openDetachRoleFromUserDialog(role) {
  DialogEvent.next({
    key: 'detach-role-from-user',
    type: 'open',
    role,
    user: user.value,
  });
}

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(loadGroups);
  reloadRolesEventRef = ReloadRolesEvent.subscribe(loadRoles);
  await search();
});

onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
  reloadRolesEventRef.unsubscribe();
});
</script>
