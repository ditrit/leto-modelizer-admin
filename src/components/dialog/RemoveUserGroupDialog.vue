<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('RemoveUserGroupDialog.text.title', { name: userGroup.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('RemoveUserGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('RemoveUserGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('RemoveUserGroupDialog.text.confirm')"
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
import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';
import * as UserGroupService from 'src/services/UserGroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const userGroup = ref(null);
const { show } = useDialog('remove-userGroup', (event) => {
  submitting.value = false;
  userGroup.value = event.userGroup;
});

/**
 * Remove userGroup, send event to reload all userGroups and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await UserGroupService.remove(userGroup.value.objectId);

  Notify.create({
    type: 'positive',
    message: t('RemoveUserGroupDialog.text.notifySuccess'),
    html: true,
  });

  ReloadUserGroupsEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
