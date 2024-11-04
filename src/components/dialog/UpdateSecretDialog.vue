<template>
  <q-dialog
    v-model="show"
    data-cy="edit-secret-dialog"
  >
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('UpdateSecretDialog.text.title', { key: secret.key }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          <q-input
            v-model="secretValue"
            outlined
            type="textarea"
            class="q-mt-md input-secret-value"
            data-cy="secret_field_key"
            :label="$t('UpdateSecretDialog.text.value')"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('UpdateSecretDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('UpdateSecretDialog.text.confirm')"
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
import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import * as SecretService from 'src/services/SecretService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const secret = ref(null);
const secretValue = ref('');
const { show } = useDialog('update-secret', (event) => {
  submitting.value = false;
  secretValue.value = '';
  secret.value = event.secret;
});

/**
 * Update secret, send event to reload all secrets and close dialog.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  return SecretService.update(secret.value.id, secret.value.key, secretValue.value)
    .then(() => Notify.create({
      type: 'positive',
      message: t('UpdateSecretDialog.text.notifySuccess'),
      html: true,
    }))
    .catch(() => Notify.create({
      type: 'negative',
      message: t('UpdateSecretDialog.text.notifyError'),
      html: true,
    })).finally(() => {
      ReloadSecretsEvent.next();

      show.value = false;
      submitting.value = false;
    });
}
</script>

<style lang="scss" scoped>
.input-secret-value, .input-secret-key {
  min-width: 400px;
}
</style>
