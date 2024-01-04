<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('RemoveUserDialog.text.title', { name: user.username }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section
          v-if="user && deleteCurrentUser"
          class="column flex-center"
        >
          <q-banner
            class="bg-negative text-white text-weight-bold"
          >
            <template #avatar>
              <q-icon
                name="fa-solid fa-triangle-exclamation"
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
import { ref, onMounted, computed } from 'vue';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import * as UserService from 'src/services/UserService';
import { getUserSessionToken, removeUserSessionToken } from 'src/composables/UserAuthentication';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const user = ref(null);
const currentUser = ref(null);
const deleteCurrentUser = computed(() => user.value
  && user.value.objectId === currentUser.value.objectId);
const { show } = useDialog('remove-user', (event) => {
  submitting.value = false;
  user.value = event.user;
});

/**
 * Remove user, send event to reload all users and close dialogue.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await UserService.remove(user.value.objectId);

  Notify.create({
    type: 'positive',
    message: t('RemoveUserDialog.text.notifySuccess'),
    html: true,
  });

  if (deleteCurrentUser.value) {
    removeUserSessionToken();

    window.location.href = `${process.env.LETO_MODELIZER_URL}/token/clear`;
  } else {
    ReloadUsersEvent.next();
  }

  submitting.value = false;
  show.value = false;
}

onMounted(async () => {
  currentUser.value = await UserService.findCurrent(getUserSessionToken());
});
</script>
