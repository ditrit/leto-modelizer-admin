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
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as UserGroupService from 'src/services/UserGroupService';

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
}]);
const userGroups = ref([]);

onMounted(async () => {
  await UserGroupService.find().then((data) => {
    userGroups.value = data;
  });
});
</script>
