<template>
  <q-dialog v-model="show">
    <q-card class="attach-role-to-user-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachRoleToUserDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachRoleToUserDialog.icon.info')"
          />
          <span>
            {{ $t('AttachRoleToUserDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <roles-table
            v-model:selected="selected"
            :roles="roles"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachRoleToUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachRoleToUserDialog.text.confirm')"
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
import { ref, computed } from 'vue';
import RolesTable from 'src/components/tables/RolesTable.vue';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const userLogin = ref('');
const selected = ref([]);
const roles = ref([]);
const isCurrentUser = computed(() => userLogin.value === userStore.login);

/**
 * Get roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return RoleService.find().then((data) => {
    roles.value = data.content;
  });
}

const { show } = useDialog('attach-role-to-user', (event) => {
  submitting.value = false;
  userLogin.value = event.userLogin;
  selected.value = [];
  return search();
});

/**
 * Attach one or more roles to a user.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const roleIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(roleIdList
    .map((roleId) => RoleService.associateRoleAndUser(userLogin.value, roleId)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachRoleToUserDialog.text.notifyError'),
          html: true,
        });

        throw new Error(roleId);
      })))
    .then((results) => {
      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          // new Error() send message of type String
          // use `+reason.message` to transform into Number
          selected.value = selected.value
            .filter(({ id }) => id === +reason.message);
        }
      });

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachRoleToUserDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
        selected.value = [];
      }
    }).finally(async () => {
      ReloadRolesEvent.next();
      submitting.value = false;

      if (isCurrentUser.value) {
        userStore.permissions = await UserService.getMyPermissions();
      }
    });
}
</script>

<style scoped>
.attach-role-to-user-form {
  min-width: 50vw;
}
</style>
