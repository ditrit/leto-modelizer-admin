<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachGroupFromGroupDialog.text.title',
                { groupToDetach: groupToDetach.name, group: group.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachGroupFromGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachGroupFromGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachGroupFromGroupDialog.text.confirm')"
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
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const group = ref(null);
const groupToDetach = ref();

const { show } = useDialog('detach-group-from-group', (event) => {
  submitting.value = false;
  group.value = event.group;
  groupToDetach.value = event.groupToDetach;
});

/**
 * Detach group, send event to reload groups and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  // TODO: generic error management
  await GroupService.dissociateGroupAndGroup(groupToDetach.value.id, group.value.id);

  Notify.create({
    type: 'positive',
    message: t('DetachGroupFromGroupDialog.text.notifySuccess'),
    html: true,
  });

  ReloadGroupsEvent.next();
  ReloadPermissionsEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
