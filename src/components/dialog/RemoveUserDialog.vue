<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('RemoveUserDialog.text.title', { name: user.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section
          v-if="user && deleteCurrentUser"
          class="column flex-center"
          data-cy="remove_current_user_warning"
        >
          <q-banner
            class="bg-negative text-white text-weight-bold"
          >
            <template #avatar>
              <q-icon
                :name="$t('RemoveUserDialog.icon.warning')"
                color="white"
              />
            </template>
            {{ $t('RemoveUserDialog.text.warning') }}
          </q-banner>
        </q-card-section>
        <q-card-section class="column flex-center">
          {{ $t('RemoveUserDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('RemoveUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('RemoveUserDialog.text.confirm')"
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
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const user = ref(null);
const deleteCurrentUser = computed(() => user.value?.login === userStore.login);
const { show } = useDialog('remove-user', (event) => {
  submitting.value = false;
  user.value = event.user;
});

/**
 * Remove user, send event to reload all users and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await UserService.remove(user.value.login);

  Notify.create({
    type: 'positive',
    message: t('RemoveUserDialog.text.notifySuccess'),
    html: true,
  });

  if (deleteCurrentUser.value) {
    window.location.href = '/api/logout';
  } else {
    ReloadUsersEvent.next();
  }

  submitting.value = false;
  show.value = false;
}
</script>
