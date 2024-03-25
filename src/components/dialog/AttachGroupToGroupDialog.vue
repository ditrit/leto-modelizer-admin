<template>
  <q-dialog v-model="show">
    <q-card class="attach-group-to-group-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachGroupToGroupDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <groups-table
            v-model:selected="selected"
            :groups="groups"
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
            :label="$t('AttachGroupToGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachGroupToGroupDialog.text.confirm')"
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
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const groupId = ref('');
const selected = ref([]);
const groups = ref([]);

/**
 * Get all roles except current group.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return GroupService.find({
    id: `not_${groupId.value}`,
  }).then((data) => {
    groups.value = data.content;
  });
}

const { show } = useDialog('attach-group-to-group', (event) => {
  submitting.value = false;
  groupId.value = event.groupId;
  selected.value = [];
  return search();
});

/**
 * Attach one or more groups to a group.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const groupIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(groupIdList
    .map((groupIdToAttach) => GroupService.associateGroupAndGroup(groupIdToAttach, groupId.value)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachGroupToGroupDialog.text.notifyError'),
          html: true,
        });

        throw new Error(groupIdToAttach);
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
          message: t('AttachGroupToGroupDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    })
    .finally(async () => {
      ReloadGroupsEvent.next();
      ReloadPermissionsEvent.next();
      submitting.value = false;
    });
}
</script>

<style scoped>
.attach-group-to-group-form {
  min-width: 50vw;
}
</style>
