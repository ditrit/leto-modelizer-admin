<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    row-key="objectId"
    :pagination="pagination"
    :columns="columns"
    :rows="userGroups"
    data-cy="userGroups_table"
  >
    <template #body-cell-actions="props">
      <q-td
        key="actions"
        :props="props"
      >
        <q-btn
          dense
          flat
          rounded
          color="primary"
          icon="fa-solid fa-pen-to-square"
          :data-cy="`userGroup_${props.row.objectId}_button_show`"
          @click="$emit('show', props.row.objectId)"
        />
        <q-btn
          dense
          flat
          rounded
          color="negative"
          icon="fa-solid fa-trash"
          :data-cy="`userGroup_${props.row.objectId}_button_remove`"
          @click="$emit('remove', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import * as UserGroupService from 'src/services/UserGroupService';
import ReloadUserGroupsEvent from 'src/composables/ReloadUserGroupsEvent';

defineEmits(['remove', 'show']);

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'name',
  required: true,
  label: t('UserGroupsTable.text.nameColumn'),
  align: 'left',
  field: 'name',
  classes: 'user-group-name',
}, {
  name: 'actions',
  required: true,
  label: t('UserGroupsTable.text.actionsColumn'),
  align: 'left',
  field: 'objectId',
  classes: 'user-group-actions',
}]);
const userGroups = ref([]);

let reloadUserGroupsEventRef;

/**
 * Search and display userGroups.
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
