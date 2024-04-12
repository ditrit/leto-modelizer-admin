<template>
  <q-page class="full-height column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg q-mr-auto"
      data-cy="page_add_group_title"
    >
      {{ $t('AddGroupPage.text.title') }}
    </h4>
    <div class="q-mb-sm">
      {{ $t('AddGroupPage.text.subtitle') }}
    </div>
    <q-linear-progress
      v-if="loading"
      indeterminate
      color="primary"
      data-cy="page_add_group_loading"
    />
    <q-form
      class="column flex-1"
      @submit="onSubmit"
      @reset="$router.push('/groups')"
    >
      <h6
        class="q-ma-none q-mb-sm"
      >
        {{ $t('AddGroupPage.text.name') }}
      </h6>
      <q-input
        v-model="name"
        outlined
        bg-color="white"
        class="group-field-name"
        data-cy="group-field-name"
        :label="$t('AddGroupPage.text.name')"
        :rules="[isValidName]"
      />
      <div class="q-pb-md">
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_add_group_users"
        >
          {{ $t('AddGroupPage.text.users') }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_add_group_button_attach_user"
          :label="$t('AddGroupPage.text.attachUser')"
          :icon="$t('AddGroupPage.icon.attach')"
          @click="openAttachUserToGroupDialog"
        />
        <users-table
          :users="selectedUsers"
          :show-action="false"
          :detach-action="false"
          :no-data-label="$t('AddGroupPage.text.addUsertoGroupMessage')"
          class="full-width"
          @remove="removeUser"
        />
      </div>
      <div class="q-pb-md">
        <h6
          class="q-ma-none q-mb-sm"
          data-cy="page_add_group_roles"
        >
          {{ $t('AddGroupPage.text.roles') }}
        </h6>
        <q-btn
          outline
          no-caps
          color="primary"
          class="bg-white q-mb-md"
          data-cy="page_add_group_button_attach_role"
          :label="$t('AddGroupPage.text.attachRole')"
          :icon="$t('AddGroupPage.icon.attach')"
          @click="openAttachRoleToGroupDialog"
        />
        <access-control-table
          :rows="selectedRoles"
          access-control-type="role"
          :show-action="false"
          :detach-action="false"
          hide-filters
          hide-pagination
          :no-data-label="$t('AddGroupPage.text.addRoletoGroupMessage')"
          class="full-width"
          @remove="removeRole"
        />
      </div>
      <q-space />
      <div class="full-width row justify-center">
        <q-btn
          :label="$t('AddGroupPage.text.cancel')"
          color="negative"
          class="q-mr-xl"
          type="reset"
          data-cy="group_button_cancel"
        />
        <q-btn
          :label="$t('AddGroupPage.text.add')"
          color="positive"
          type="submit"
          :loading="submitting"
          :disable="addButtonDisabled"
          data-cy="group_button_add"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
} from 'vue';
import { useFieldRules } from 'src/composables/FieldRules';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import UsersTable from 'src/components/tables/UsersTable.vue';
import AccessControlTable from 'src/components/tables/AccessControlTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import SelectEvent from 'src/composables/events/SelectEvent';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

let selectUsersSubscription;
let selectRolesSubscription;

const { t } = useI18n();
const router = useRouter();
const name = ref('');
const selectedUsers = ref([]);
const selectedRoles = ref([]);
const loading = ref(false);
const submitting = ref(false);
const addButtonDisabled = computed(
  () => !selectedUsers.value.length || !selectedRoles.value.length || !name.value.length,
);
const { isValidName } = useFieldRules('AddGroupPage');

/**
 * Set selected users.
 * @param {object} event - Event object representing selected Users.
 */
async function setSelectedUsers(event) {
  selectedUsers.value = event;
}

/**
 * Set selected roles.
 * @param {object} event - Event object representing selected roles.
 */
async function setSelectedRoles(event) {
  selectedRoles.value = event;
}

/**
 * Update selected users.
 * @param {object} user - User to remove from selected users.
 */
async function removeUser(user) {
  selectedUsers.value = selectedUsers.value.filter(({ login }) => login !== user.login);
}

/**
 * Update selected roles.
 * @param {object} role - Role to remove from selected roles.
 */
async function removeRole(role) {
  selectedRoles.value = selectedRoles.value.filter(({ id }) => id !== role.id);
}

/**
 * Create a notification using the Quasar Notify plugin.
 * @param {string} type - The type of notification.
 * @param {string} dialogName - The name of the dialog.
 */
function createNotification(type, dialogName) {
  Notify.create({
    type,
    message: t(`${dialogName}.text.notify${type === 'negative' ? 'Error' : 'Success'}`),
    html: true,
  });
}

/**
 * Process failed request for group and user association.
 * Filters selected user objects by login and pushes them into the provided array.
 * Throws an error with the provided login.
 * @param {Array} rejectedUsers - The array to which filtered user objects will be pushed.
 * @param {string} login - The login to filter user objects by.
 * @throws {Error} Throws an error with the provided login.
 */
function handleGroupUserFailure(rejectedUsers, login) {
  rejectedUsers.push(...selectedUsers.value
    .filter((selectedUser) => selectedUser.login === login));

  throw new Error(login);
}

/**
 * Process failed request for group and role association.
 * Filters selected role objects by id and pushes them into the provided array.
 * Throws an error with the provided id.
 * @param {Array} rejectedRoles - The array to which filtered role objects will be pushed.
 * @param {string} id - The id to filter role objects by.
 * @throws {Error} Throws an error with the provided id.
 */
function handleGroupRoleFailure(rejectedRoles, id) {
  rejectedRoles.push(...selectedRoles.value
    .filter((selectedRole) => selectedRole.id === id));

  throw new Error(id);
}

/**
 * Open dialog to select a user to attach to a group.
 */
function openAttachUserToGroupDialog() {
  DialogEvent.next({
    key: 'attach-user-to-group',
    type: 'open',
    selectOnly: true,
  });
}

/**
 * Open dialog to select a role to attach to a group.
 */
function openAttachRoleToGroupDialog() {
  DialogEvent.next({
    key: 'attach-access-control',
    type: 'open',
    selectOnly: true,
    accessControlType: 'role',
    targetAccessControlType: 'group',
  });
}

/**
 * Create group, associate selected user(s) and role(s),
 * then redirect to its page or display error message.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  return GroupService
    .create(name.value)
    .then((newGroup) => {
      const rejectedUsers = [];
      const rejectedRoles = [];

      const associateGroupAndUserPromises = selectedUsers.value
        .map(({ login }) => GroupService.associateGroupAndUser(login, newGroup.id)
          .catch(() => {
            createNotification('negative', 'AttachUserToGroupDialog');
            handleGroupUserFailure(rejectedUsers, login);
          }));

      const associateGroupAndRolePromises = selectedRoles.value
        .map(({ id }) => RoleService.associateRoleAndGroup(newGroup.id, id)
          .catch(() => {
            createNotification('negative', 'AttachRoleToGroupDialog');
            handleGroupRoleFailure(rejectedRoles, id);
          }));

      Promise.allSettled(associateGroupAndUserPromises.concat(associateGroupAndRolePromises))
        .then((results) => {
          selectedUsers.value = rejectedUsers;
          selectedRoles.value = rejectedRoles;

          createNotification('positive', 'AddGroupPage');

          if (results.every(({ status }) => status === 'fulfilled')) {
            router.push(`/groups/${newGroup.id}`);
          }
        });
    })
    .catch(() => {
      createNotification('negative', 'AddGroupPage');
    })
    .finally(() => {
      name.value = '';
      submitting.value = false;
    });
}

onMounted(() => {
  selectUsersSubscription = SelectEvent.SelectUsersEvent.subscribe(setSelectedUsers);
  selectRolesSubscription = SelectEvent.SelectRolesEvent.subscribe(setSelectedRoles);
});

onUnmounted(() => {
  selectUsersSubscription.unsubscribe();
  selectRolesSubscription.unsubscribe();
});
</script>
