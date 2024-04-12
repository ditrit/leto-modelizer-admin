<template>
  <q-dialog v-model="show">
    <q-card class="attach-user-to-role-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachUserToRoleDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachUserToRoleDialog.icon.info')"
          />
          <span>
            {{ $t('AttachUserToRoleDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <users-table
            v-model:selected="selected"
            :users="users"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            :no-data-label="$t('UsersTable.text.noData')"
            :no-data-icon="$t('UsersTable.icon.noData')"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachUserToRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachUserToRoleDialog.text.confirm')"
            :loading="submitting"
            :disable="!selected.length"
            type="submit"
            color="positive"
            data-cy="button_confirm"
          >
            <template #loading>
              <q-spinner-hourglass />
            </template>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialog } from 'src/composables/Dialog';
import { ref } from 'vue';
import UsersTable from 'src/components/tables/UsersTable.vue';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const roleId = ref('');
const selected = ref([]);
const users = ref([]);

/**
 * Get all users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserService.find().then((data) => {
    users.value = data.content;
  });
}

const { show } = useDialog('attach-user-to-role', (event) => {
  submitting.value = false;
  roleId.value = event.roleId;
  selected.value = [];
  return search();
});

/**
 * Attach one or more users to a role.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const userLoginList = selected.value.map(({ login }) => login);

  await Promise.allSettled(userLoginList
    .map((userLogin) => RoleService.associateRoleAndUser(userLogin, roleId.value)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachUserToRoleDialog.text.notifyError'),
          html: true,
        });

        throw new Error(userLogin);
      })))
    .then((results) => {
      const failedRequestObjects = [];

      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          failedRequestObjects.push(...selected.value
            .filter(({ login }) => login === reason.message));
        }
      });

      selected.value = failedRequestObjects;

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachUserToRoleDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    })
    .finally(async () => {
      ReloadUsersEvent.next();
      submitting.value = false;

      if (userLoginList.includes(userStore.login)) {
        userStore.permissions = await UserService.getMyPermissions();
      }
    });
}
</script>

<style scoped>
.attach-user-to-role-form {
  min-width: 50vw;
}
</style>
