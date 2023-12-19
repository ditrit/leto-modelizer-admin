<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    row-key="objectId"
    :pagination="pagination"
    :columns="columns"
    :rows="users"
    data-cy="users_table"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as UsersService from 'src/services/UserService';

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'name',
  required: true,
  label: t('UsersTable.text.nameColumn'),
  align: 'left',
  field: 'firstname',
  classes: 'user-firstname',
}, {
  name: 'userName',
  required: true,
  label: t('UsersTable.text.userNameColumn'),
  align: 'left',
  field: 'username',
  classes: 'user-username',
}, {
  name: 'email',
  required: true,
  label: t('UsersTable.text.emailColumn'),
  align: 'left',
  field: 'email',
  classes: 'user-email',
}]);
const users = ref([]);

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
  await search();
});
</script>