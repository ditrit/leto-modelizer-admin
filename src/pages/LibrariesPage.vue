<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_libraries_title"
    >
      {{ $t('LibrariesPage.text.title') }}
    </h4>
    <libraries-table />
  </q-page>
</template>

<script setup>
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
</script>
