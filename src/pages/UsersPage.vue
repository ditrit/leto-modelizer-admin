<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_users_title"
    >
      {{ $t('IndexPage.text.title') }}
    </h4>
    <users-table
      :users="users"
      @show="goToUser"
      @remove="openRemoveUserDialog"
    />
  </q-page>
</template>

<script setup>
import UsersTable from 'src/components/tables/UsersTable.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as UsersService from 'src/services/UserService';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';

const router = useRouter();
const users = ref([]);
let reloadUsersEventRef;

/**
 * Go to user page.
 * @param {string} id - User id.
 */
function goToUser(id) {
  router.push(`/users/${id}`);
}

/**
 * Open dialog to remove user.
 * @param {object} user - User object to remove for the dialog.
 */
function openRemoveUserDialog(user) {
  DialogEvent.next({
    key: 'remove-user',
    type: 'open',
    user,
  });
}

/**
 * Search and display users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UsersService.find().then((data) => {
    users.value = data;
  });
}

onMounted(async () => {
  reloadUsersEventRef = ReloadUsersEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadUsersEventRef.unsubscribe();
});
</script>
