<template>
  <q-tab-panel name="information">
    <div class="text-h6">
      {{ $t('InformationLibraryTabPanel.text.synchronizeTitle') }}
    </div>
    <q-form @submit="synchronize">
      <q-input
        v-model="url"
        outlined
        bg-color="white"
        class="library-field-url q-mb-md"
        data-cy="library-field-url"
        :rules="[notEmpty]"
        :error="urlError"
        :error-message="urlErrorMessage"
        @update:model-value="clearUrlError"
      />
      <q-btn
        no-caps
        type="submit"
        color="positive"
        data-cy="library-button-synchronize"
        :loading="loading"
        :icon="$t('InformationLibraryTabPanel.icon.synchronize')"
        :label="$t('InformationLibraryTabPanel.text.synchronize')"
      >
        <template #loading>
          <q-spinner-hourglass />
        </template>
      </q-btn>
    </q-form>
  </q-tab-panel>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as LibraryService from 'src/services/LibraryService';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { useFieldRules } from 'src/composables/FieldRules';

const emits = defineEmits(['synchronize']);
const props = defineProps({
  library: {
    type: Object,
    default: null,
  },
});
const { t } = useI18n();
const { notEmpty } = useFieldRules('InformationLibraryTabPanel');
const url = ref('');
const loading = ref(false);
const urlError = ref(false);
const urlErrorMessage = ref('');
const ERROR_LIBRARY_URL_ALREADY_EXIST = 'Library with this url already exists';

/**
 * Clear url field error.
 */
function clearUrlError() {
  urlError.value = false;
  urlErrorMessage.value = '';
}

/**
 * Synchronize library then emit synchronize event on success.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function synchronize() {
  loading.value = true;
  clearUrlError();

  return LibraryService.synchronize(props.library.objectId, url.value)
    .then(() => {
      emits('synchronize');

      Notify.create({
        type: 'positive',
        message: t('InformationLibraryTabPanel.text.synchronizeSuccess'),
        html: true,
      });
    })
    .catch(({ message }) => {
      if (message === ERROR_LIBRARY_URL_ALREADY_EXIST) {
        urlError.value = true;
        urlErrorMessage.value = t('AddLibraryPage.text.urlAlreadyExists');
      } else {
        urlError.value = true;
        urlErrorMessage.value = t('AddLibraryPage.text.urlNotFound');
      }

      Notify.create({
        type: 'negative',
        message: t('InformationLibraryTabPanel.text.synchronizeError'),
        html: true,
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(() => props.library, () => {
  url.value = props.library.url;
});
</script>
