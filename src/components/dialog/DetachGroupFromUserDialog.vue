<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachGroupFromUserDialog.text.title',
                { group: group.name, user: user.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachGroupFromUserDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachGroupFromUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachGroupFromUserDialog.text.confirm')"
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
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const group = ref(null);
const user = ref();
const { show } = useDialog('detach-group-from-user', (event) => {
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

  await GroupService.dissociateGroupAndUser(user.value.login, group.value.id);

  Notify.create({
    type: 'positive',
    message: t('DetachGroupFromUserDialog.text.notifySuccess'),
    html: true,
  });

  ReloadGroupsEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
