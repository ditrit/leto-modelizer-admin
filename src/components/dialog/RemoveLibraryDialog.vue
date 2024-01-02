<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row">
        <span class="text-h6 text-center">
          {{ $t('RemoveLibraryDialog.text.title', { name: library.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t('RemoveLibraryDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('RemoveLibraryDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('RemoveLibraryDialog.text.confirm')"
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
import ReloadLibrariesEvent from 'src/composables/events/ReloadLibrariesEvent';
import * as LibraryService from 'src/services/LibraryService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const submitting = ref(false);
const library = ref(null);
const { show } = useDialog('remove-library', (event) => {
  submitting.value = false;
  library.value = event.library;
});

/**
 * Remove library, send event to reload all libraries and close dialogue.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await LibraryService.remove(library.value.objectId);

  Notify.create({
    type: 'positive',
    message: t('RemoveLibraryDialog.text.notifySuccess'),
    html: true,
  });

  ReloadLibrariesEvent.next();

  submitting.value = false;
  show.value = false;
}
</script>
