<template>
  <q-dialog v-model="show">
    <q-card class="attach-permission-to-role-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachPermissionToRoleDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <permissions-table
            v-model:selected="selected"
            :permissions="permissions"
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
            :label="$t('AttachPermissionToRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachPermissionToRoleDialog.text.confirm')"
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
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import * as PermissionService from 'src/services/PermissionService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const roleId = ref('');
const selected = ref([]);
const permissions = ref([]);

/**
 * Get all permissions.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return PermissionService.find().then((data) => {
    permissions.value = data.content;
  });
}

const { show } = useDialog('attach-permission-to-role', (event) => {
  submitting.value = false;
  roleId.value = event.roleId;
  selected.value = [];
  return search();
});

/**
 * Attach one or more permissions to a role.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const permissionIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(permissionIdList
    .map((permissionId) => RoleService.associateRoleAndPermission(roleId.value, permissionId)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachPermissionToRoleDialog.text.notifyError'),
          html: true,
        });

        throw new Error(permissionId);
      })))
    .then((results) => {
      const failedRequestObjects = [];

      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          failedRequestObjects.push(...selected.value
            .filter(({ id }) => id === reason.message));
        }
      });

      selected.value = failedRequestObjects;

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachPermissionToRoleDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    })
    .finally(async () => {
      ReloadPermissionsEvent.next();
      submitting.value = false;
      userStore.permissions = await UserService.getMyPermissions();
    });
}
</script>

<style scoped>
.attach-permission-to-role-form {
  min-width: 60vw;
}
</style>
