<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachPermissionFromRoleDialog.text.title',
                { permission: $t(`Permissions.text.${permission.key}`),
                  role: role.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachPermissionFromRoleDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachPermissionFromRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachPermissionFromRoleDialog.text.confirm')"
            :loading="submitting"
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
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const permission = ref(null);
const role = ref();

const { show } = useDialog('detach-permission-from-role', (event) => {
  submitting.value = false;
  permission.value = event.permission;
  role.value = event.role;
});

/**
 * Detach permission, send event to reload permissions and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  // TODO: generic error management
  await RoleService.dissociateRoleAndPermission(role.value.id, permission.value.id);

  Notify.create({
    type: 'positive',
    message: t('DetachPermissionFromRoleDialog.text.notifySuccess'),
    html: true,
  });

  ReloadPermissionsEvent.next();

  userStore.permissions = await UserService.getMyPermissions();

  submitting.value = false;
  show.value = false;
}
</script>
