<template>
  <q-page class="column q-pa-md bg-grey-1">
    <div class="row justify-center items-center">
      <h4
        class="q-ma-none q-mt-md q-mb-lg q-mr-auto"
        data-cy="page_libraries_title"
      >
        {{ $t('LibrariesPage.text.title') }}
      </h4>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white"
        data-cy="libraries_button_add"
        :label="$t('LibrariesPage.text.add')"
        :icon="$t('LibrariesPage.icon.add')"
        @click="$router.push('/add-library')"
      />
    </div>
    <libraries-table
      @show="goToLibrary"
      @remove="openRemoveLibraryDialog"
    />
  </q-page>
</template>

<script setup>
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

const router = useRouter();

/**
 * Go to library page.
 * @param {string} id - Library id.
 */
function goToLibrary(id) {
  router.push(`/libraries/${id}`);
}

/**
 * Open dialog to remove library.
 * @param {object} library - Library object to remove for the dialog.
 */
function openRemoveLibraryDialog(library) {
  DialogEvent.next({
    key: 'remove-library',
    type: 'open',
    library,
  });
}
</script>
