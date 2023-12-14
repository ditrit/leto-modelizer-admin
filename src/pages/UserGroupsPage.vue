<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_userGroups_title"
    >
      {{ $t('UserGroupsPage.text.title') }}
    </h4>
    <user-groups-table />
  </q-page>
</template>

<script setup>
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
</script>
