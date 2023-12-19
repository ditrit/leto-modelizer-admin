<template>
  <q-page class="full-height column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg q-mr-auto"
      data-cy="page_add_library_title"
    >
      {{ $t('AddLibraryPage.text.title') }}
    </h4>
    <q-form
      class="column flex-1"
      @submit="onSubmit"
      @reset="$router.push('/libraries')"
    >
      <q-input
        v-model="roleName"
        outlined
        bg-color="white"
        class="library-field-roleName"
        data-cy="library-field-roleName"
        :label="$t('AddLibraryPage.text.roleName')"
        :rules="[notEmpty]"
        :error="roleNameError"
        :error-message="roleNameErrorMessage"
        @update:model-value="clearRoleNameError"
      />
      <q-input
        v-model="url"
        outlined
        bg-color="white"
        class="library-field-url"
        data-cy="library-field-url"
        :label="$t('AddLibraryPage.text.url')"
        :rules="[notEmpty]"
        :error="urlError"
        :error-message="urlErrorMessage"
        @update:model-value="clearUrlError"
      />
      <q-space />
      <div class="full-width row justify-center">
        <q-btn
          label="cancel"
          color="negative"
          class="q-mr-xl"
          type="reset"
          data-cy="library-button-cancel"
        />
        <q-btn
          label="Add"
          color="positive"
          type="submit"
          data-cy="library-button-add"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useFieldRules } from 'src/composables/FieldRules';
import * as LibraryService from 'src/services/LibraryService';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const url = ref('');
const urlError = ref(false);
const urlErrorMessage = ref('');
const roleName = ref('');
const roleNameError = ref(false);
const roleNameErrorMessage = ref('');
const { notEmpty } = useFieldRules('AddLibraryPage');
const ERROR_LIBRARY_URL_ALREADY_EXIST = 'Library with this url already exists';
const ERROR_LIBRARY_ROLE_ALREADY_EXIST = 'Library with this roleName already exists';

/**
 * Clear url field error.
 */
function clearUrlError() {
  urlError.value = false;
  urlErrorMessage.value = '';
}

/**
 * clear role name field error.
 */
function clearRoleNameError() {
  roleNameError.value = false;
  roleNameErrorMessage.value = '';
}

/**
 * Create library and redirect to its page or display error in form.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  clearRoleNameError();
  clearUrlError();

  return LibraryService
    .create(url.value, roleName.value)
    .then(({ objectId }) => {
      Notify.create({
        type: 'positive',
        message: t('LibraryPage.text.notifySuccess'),
        html: true,
      });
      router.push(`/libraries/${objectId}`);
    })
    .catch(({ message }) => {
      if (message === ERROR_LIBRARY_URL_ALREADY_EXIST) {
        urlError.value = true;
        urlErrorMessage.value = t('AddLibraryPage.text.urlAlreadyExists');
      } else if (message === ERROR_LIBRARY_ROLE_ALREADY_EXIST) {
        roleNameError.value = true;
        roleNameErrorMessage.value = t('AddLibraryPage.text.roleNameAlreadyExists');
      } else {
        urlError.value = true;
        urlErrorMessage.value = t('AddLibraryPage.text.urlNotFound');
      }

      Notify.create({
        type: 'negative',
        message: t('AddLibraryPage.text.notifyError'),
        html: true,
      });
    });
}
</script>
