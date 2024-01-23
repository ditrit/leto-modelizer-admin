<template>
  <q-dialog v-model="show">
    <q-card class="attach-group-to-user-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachGroupToUserDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <user-groups-table
            v-model:selected="selected"
            :user-groups="userGroups"
            :show-action="false"
            :remove-action="false"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachGroupToUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachGroupToUserDialog.text.confirm')"
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
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import ReloadUserAttachedGroupsEvent from 'src/composables/events/ReloadUserAttachedGroupsEvent';
import * as UserGroupService from 'src/services/UserGroupService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const groupName = ref('');
const userId = ref('');
const selected = ref([]);
const userGroups = ref([]);

/**
 * Get user groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserGroupService.find().then((data) => {
    userGroups.value = data;
  });
}

const { show } = useDialog('attach-group-to-user', (event) => {
  submitting.value = false;
  groupName.value = '';
  userId.value = event.userId;
  return search();
});

/**
 * Attach one or more groups to a user.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const groupIdList = selected.value.map(({ objectId }) => objectId);

  await UserService.attachGroups(userId.value, groupIdList)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('AttachGroupToUserDialog.text.notifySuccess'),
        html: true,
      });
      show.value = false;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('AttachGroupToUserDialog.text.notifyError'),
        html: true,
      });
    });

  ReloadUserAttachedGroupsEvent.next();

  selected.value = [];
  submitting.value = false;
}
</script>

<style scoped>
.attach-group-to-user-form {
  min-width: 50vw;
}
</style>
