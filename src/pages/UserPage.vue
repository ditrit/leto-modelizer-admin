<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
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
      </q-card-section>
      <q-card-section class=" q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_user_title"
        >
          {{ user.firstname }}
        </h4>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_user_loading"
      />
    </q-card>
    <q-card-section>
      <h6
        class="q-ma-none q-mb-sm"
        data-cy="page_user_roles_title"
      >
        {{ $t('UserPage.text.roleList', { user: user.firstname }) }}
      </h6>
      <roles-table
        :roles="roles"
      />
    </q-card-section>
    <q-card-section>
      <h6
        class="q-ma-none q-mb-sm"
        data-cy="page_user_groups_title"
      >
        {{ $t('UserPage.text.groupList', { user: user.firstname }) }}
      </h6>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white q-mb-md"
        data-cy="page_user_button_attach_group"
        :label="$t('UserPage.text.attach')"
        :icon="$t('UserPage.icon.attach')"
        @click="openAttachGroupToUserDialog"
      />
      <groups-table
        :groups="groups"
        :show-action="false"
        @remove="openDetachGroupDialog"
      />
    </q-card-section>
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

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = ref({});
const groups = ref([]);
const roles = ref([]);

let reloadGroupsEventRef;

/**
 * Load user from id in url. If the user does not exist, redirect to the users page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUser() {
  return UserService.findById(route.params.id)
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
 * Get groups using user Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroups() {
  return GroupService.findByUserId(route.params.id).then((data) => {
    groups.value = data;
  });
}

/**
 * Get roles using user Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadRoles() {
  return RoleService.findByUserId(route.params.id).then((data) => {
    roles.value = data;
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
    userId: route.params.id,
  });
}

/**
 * Open dialog to remove user group.
 * @param {object} group - User group object to remove for the dialog.
 */
function openDetachGroupDialog(group) {
  DialogEvent.next({
    key: 'detach-group',
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
