<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachUserFromGroupDialog.text.title',
                { user: user.name, group: group.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('DetachUserFromGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachUserFromGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachUserFromGroupDialog.text.confirm')"
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
import { ref, computed } from 'vue';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const group = ref(null);
const user = ref();
const isCurrentUser = computed(() => user.value?.login === userStore.login);

const { show } = useDialog('detach-user-from-group', (event) => {
  submitting.value = false;
  group.value = event.group;
  user.value = event.user;
});

/**
 * Detach user, send event to reload users and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  // TODO: generic error management
  await GroupService.dissociateGroupAndUser(user.value.login, group.value.id);

  Notify.create({
    type: 'positive',
    message: t('DetachUserFromGroupDialog.text.notifySuccess'),
    html: true,
  });

  ReloadUsersEvent.next();

  if (isCurrentUser.value) {
    userStore.permissions = await UserService.getMyPermissions();
  }

  submitting.value = false;
  show.value = false;
}
</script>
