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
import { getUserGroups } from 'src/composables/LetoModelizerApi';
import { getUserSessionToken } from 'src/composables/UserAuthentication';
import { useI18n } from 'vue-i18n';

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
  await getUserGroups(getUserSessionToken()).then((response) => {
    userGroups.value = response.data.results;
  });
});
</script>
