<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_roles_title"
    >
      {{ $t('RolesPage.text.title') }}
    </h4>
    <roles-table />
  </q-page>
</template>

<script setup>
import RolesTable from 'src/components/tables/RolesTable.vue';
</script>
