<template>
  <q-dialog v-model="show">
    <q-card class="attach-group-to-user-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachGroupToUserDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachGroupToUserDialog.icon.info')"
          />
          <span>
            {{ $t('AttachGroupToUserDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <groups-table
            v-model:selected="selected"
            :groups="groups"
            :show-action="false"
            :detach-action="false"
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
import { ref, computed } from 'vue';
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const userLogin = ref('');
const selected = ref([]);
const groups = ref([]);
const isCurrentUser = computed(() => userLogin.value === userStore.login);

/**
 * Get groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return GroupService.find().then((data) => {
    groups.value = data.content;
  });
}

const { show } = useDialog('attach-group-to-user', (event) => {
  submitting.value = false;
  userLogin.value = event.userLogin;
  selected.value = [];
  return search();
});

/**
 * Attach one or more groups to a user.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const groupIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(groupIdList
    .map((groupId) => GroupService.associateGroupAndUser(userLogin.value, groupId)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachGroupToUserDialog.text.notifyError'),
          html: true,
        });

        throw new Error(groupId);
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
          message: t('AttachGroupToUserDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    }).finally(async () => {
      ReloadGroupsEvent.next();
      submitting.value = false;

      if (isCurrentUser.value) {
        userStore.permissions = await UserService.getMyPermissions();
      }
    });
}
</script>

<style scoped>
.attach-group-to-user-form {
  min-width: 50vw;
}
</style>
