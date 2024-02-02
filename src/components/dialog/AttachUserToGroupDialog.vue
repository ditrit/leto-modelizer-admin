<template>
  <q-dialog v-model="show">
    <q-card class="attach-user-to-group-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachUserToGroupDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <users-table
            v-model:selected="selected"
            :users="users"
            :show-action="false"
            :remove-action="false"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachUserToGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachUserToGroupDialog.text.confirm')"
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
import UsersTable from 'src/components/tables/UsersTable.vue';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const groupId = ref('');
const selected = ref([]);
const users = ref([]);

/**
 * Get users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserService.find().then((data) => {
    users.value = data;
  });
}

const { show } = useDialog('attach-user-to-group', (event) => {
  submitting.value = false;
  groupId.value = event.groupId;
  return search();
});

/**
 * Attach one or more users to a group.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const userIdList = selected.value.map(({ objectId }) => objectId);

  await Promise.allSettled(userIdList
    .map((userId) => UserService.addUserToGroup(userId, groupId.value)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachUserToGroupDialog.text.notifyError'),
          html: true,
        });

        throw new Error(userId);
      })))
    .then((results) => {
      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          selected.value = selected.value
            .filter(({ objectId }) => objectId === reason.message);
        }
      });

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachUserToGroupDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
        selected.value = [];
      }
    }).finally(() => {
      ReloadUsersEvent.next();
      submitting.value = false;
    });
}
</script>

<style scoped>
.attach-user-to-group-form {
  min-width: 50vw;
}
</style>