<template>
  <q-page class="column q-pa-md bg-grey-1">
    <div class="row justify-center items-center">
      <h4
        class="q-ma-none q-mt-md q-mb-lg q-mr-auto"
        data-cy="page_groups_title"
      >
        {{ $t('GroupsPage.text.title') }}
      </h4>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white"
        data-cy="groups_button_add"
        :label="$t('GroupsPage.text.add')"
        :icon="$t('GroupsPage.icon.add')"
        @click="$router.push('/add-group')"
      />
    </div>
    <groups-table
      :groups="groups"
      :detach-action="false"
      @show="goToGroup"
      @remove="openRemoveGroupDialog"
    />
  </q-page>
</template>

<script setup>
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import * as GroupService from 'src/services/GroupService';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';

const router = useRouter();
const groups = ref([]);

let reloadGroupsEventRef;

/**
 * Go to user group page.
 * @param {string} id - User group id.
 */
function goToGroup(id) {
  router.push(`/groups/${id}`);
}

/**
 * Open dialog to remove user group.
 * @param {object} group - User group object to remove for the dialog.
 */
function openRemoveGroupDialog(group) {
  DialogEvent.next({
    key: 'remove-group',
    type: 'open',
    group,
  });
}

/**
 * Get groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return GroupService.find().then((data) => {
    groups.value = data.content;
  });
}

onMounted(async () => {
  reloadGroupsEventRef = ReloadGroupsEvent.subscribe(search);
  await search();
});
onUnmounted(() => {
  reloadGroupsEventRef.unsubscribe();
});
</script>
