<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_libraries_title"
    >
      {{ $t('LibrariesPage.text.title') }}
    </h4>
    <libraries-table
      @show="goToLibrary"
      @remove="openRemoveLibraryDialog"
    />
  </q-page>
</template>

<script setup>
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/DialogEvent';

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
