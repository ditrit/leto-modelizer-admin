<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_userGroups_title"
    >
      {{ $t('UserGroupsPage.text.title') }}
    </h4>
    <user-groups-table
      @show="goToUserGroup"
      @remove="openRemoveUserGroupDialog"
    />
  </q-page>
</template>

<script setup>
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

const router = useRouter();

/**
 * Go to user group page.
 * @param {string} id - User group id.
 */
function goToUserGroup(id) {
  router.push(`/user-groups/${id}`);
}

/**
 * Open dialog to remove user group.
 * @param {object} userGroup - User group object to remove for the dialog.
 */
function openRemoveUserGroupDialog(userGroup) {
  DialogEvent.next({
    key: 'remove-userGroup',
    type: 'open',
    userGroup,
  });
}
</script>
