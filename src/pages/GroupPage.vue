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
      <q-card-section class=" q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_group_title"
        >
          {{ group.name }}
        </h4>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_group_loading"
      />
    </q-card>
    <q-card-section>
      <h6
        class="q-ma-none q-mb-sm"
        data-cy="page_group_users_title"
      >
        {{ $t('GroupPage.text.roleList', { group: group.name }) }}
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
        @remove="openDetachUserFromGroupDialog"
      />
    </q-card-section>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import UsersTable from 'src/components/tables/UsersTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const group = ref({});
const users = ref([]);
let reloadUsersEventRef;

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
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([
    loadGroup(),
    loadUsers(),
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

onMounted(async () => {
  reloadUsersEventRef = ReloadUsersEvent.subscribe(loadUsers);
  await search();
});

onUnmounted(() => {
  reloadUsersEventRef.unsubscribe();
});
</script>
