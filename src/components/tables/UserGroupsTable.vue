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
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as UserGroupService from 'src/services/UserGroupService';

defineEmits(['show']);

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

onMounted(async () => {
  await UserGroupService.find().then((data) => {
    userGroups.value = data;
  });
});
</script>
