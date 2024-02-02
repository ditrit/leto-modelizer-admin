<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachGroupDialog.text.title', { group: group.name, user: user.firstname }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachGroupDialog.text.confirm')"
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
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const group = ref(null);
const user = ref();
const { show } = useDialog('detach-group', (event) => {
  submitting.value = false;
  group.value = event.group;
  user.value = event.user;
});

/**
 * Detach group, send event to reload user groups and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await UserService.removeUserFromGroup(user.value.objectId, group.value.objectId);

  Notify.create({
    type: 'positive',
    message: t('DetachGroupDialog.text.notifySuccess'),
    html: true,
  });

  ReloadGroupsEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
