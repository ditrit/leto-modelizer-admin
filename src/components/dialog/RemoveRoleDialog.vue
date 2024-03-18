<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('RemoveRoleDialog.text.title', { name: role.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('RemoveRoleDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('RemoveRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('RemoveRoleDialog.text.confirm')"
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
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const role = ref(null);
const { show } = useDialog('remove-role', (event) => {
  submitting.value = false;
  role.value = event.role;
});

/**
 * Remove role, send event to reload all roles and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await RoleService.remove(role.value.id)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('RemoveRoleDialog.text.notifySuccess'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('RemoveRoleDialog.text.notifyError'),
        html: true,
      });
    });

  ReloadRolesEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
