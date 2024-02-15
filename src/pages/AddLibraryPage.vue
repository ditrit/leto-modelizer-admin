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
        v-model="role"
        outlined
        bg-color="white"
        class="library-field-role"
        data-cy="library_field_role"
        :label="$t('AddLibraryPage.text.role')"
        :rules="[notEmpty]"
        :error="roleError"
        :error-message="roleErrorMessage"
        @update:model-value="clearRoleError"
      />
      <q-input
        v-model="url"
        outlined
        bg-color="white"
        class="library-field-url"
        data-cy="library_field_url"
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
          data-cy="library_button_cancel"
        />
        <q-btn
          label="Add"
          color="positive"
          type="submit"
          data-cy="library_button_add"
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
const role = ref('');
const roleError = ref(false);
const roleErrorMessage = ref('');
const { notEmpty } = useFieldRules('AddLibraryPage');
const ERROR_LIBRARY_URL_ALREADY_EXIST = 'Library with this url already exists';
const ERROR_LIBRARY_ROLE_ALREADY_EXIST = 'Library with this role already exists';

/**
 * Clear url field error.
 */
function clearUrlError() {
  urlError.value = false;
  urlErrorMessage.value = '';
}

/**
 * clear role field error.
 */
function clearRoleError() {
  roleError.value = false;
  roleErrorMessage.value = '';
}

/**
 * Create library and redirect to its page or display error in form.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  clearRoleError();
  clearUrlError();

  return LibraryService
    .create(url.value, role.value)
    .then(({ id }) => {
      Notify.create({
        type: 'positive',
        message: t('AddLibraryPage.text.notifySuccess'),
        html: true,
      });
      router.push(`/libraries/${id}`);
    })
    .catch((error) => {
      const { message } = error.response.data;

      if (message === ERROR_LIBRARY_URL_ALREADY_EXIST) {
        urlError.value = true;
        urlErrorMessage.value = t('AddLibraryPage.text.urlAlreadyExists');
      } else if (message === ERROR_LIBRARY_ROLE_ALREADY_EXIST) {
        roleError.value = true;
        roleErrorMessage.value = t('AddLibraryPage.text.roleAlreadyExists');
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
