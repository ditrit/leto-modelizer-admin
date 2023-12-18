<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_users_title"
    >
      {{ $t('IndexPage.text.title') }}
    </h4>
    <users-table />
  </q-page>
</template>

<script setup>
import UsersTable from 'src/components/tables/UsersTable.vue';
</script>
