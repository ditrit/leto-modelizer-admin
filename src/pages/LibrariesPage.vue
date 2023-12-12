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
    />
  </q-page>
</template>

<script setup>
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Go to library page.
 * @param {string} id - Library id.
 */
function goToLibrary(id) {
  router.push(`/libraries/${id}`);
}
</script>
