<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_users_title"
    >
      {{ $t('IndexPage.text.title') }}
    </h4>
    <users-table
      @show="goToUser"
    />
  </q-page>
</template>

<script setup>
import UsersTable from 'src/components/tables/UsersTable.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Go to user page.
 * @param {string} id - User id.
 */
function goToUser(id) {
  router.push(`/users/${id}`);
}
</script>
