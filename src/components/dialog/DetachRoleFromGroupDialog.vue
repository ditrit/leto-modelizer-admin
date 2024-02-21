<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachRoleFromGroupDialog.text.title',
                { role: role.name, group: group.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachRoleFromGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachRoleFromGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachRoleFromGroupDialog.text.confirm')"
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
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const group = ref(null);
const role = ref();

const { show } = useDialog('detach-role-from-group', (event) => {
  submitting.value = false;
  group.value = event.group;
  role.value = event.role;
});

/**
 * Detach role, send event to reload roles and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  // TODO: generic error management
  await RoleService.dissociateRoleAndGroup(group.value.id, role.value.id);

  Notify.create({
    type: 'positive',
    message: t('DetachRoleFromGroupDialog.text.notifySuccess'),
    html: true,
  });

  ReloadRolesEvent.next();

  userStore.permissions = await UserService.getMyPermissions();

  submitting.value = false;
  show.value = false;
}
</script>
