<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_userGroups_title"
    >
      {{ $t('UserGroupsPage.text.title') }}
    </h4>
    <user-groups-table
      :user-groups="userGroups"
      @show="goToUserGroup"
      @remove="openRemoveUserGroupDialog"
    />
  </q-page>
</template>

<script setup>
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import * as UserGroupService from 'src/services/UserGroupService';
import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';

const router = useRouter();
const userGroups = ref([]);

let reloadUserGroupsEventRef;

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

/**
 * Get user groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserGroupService.find().then((data) => {
    userGroups.value = data;
  });
}

onMounted(async () => {
  reloadUserGroupsEventRef = ReloadUserGroupsEvent.subscribe(search);
  await search();
});
onUnmounted(() => {
  reloadUserGroupsEventRef.unsubscribe();
});
</script>
