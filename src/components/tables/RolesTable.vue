<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    :pagination="pagination"
    :columns="columns"
    :rows="roles"
    :row-key="rowKey"
    data-cy="roles_table"
  >
    <template #body-cell-type="cell">
      <q-td
        :props="cell"
        class="flex items-center"
      >
        <q-badge
          :color="cell.row.color"
          rounded
          class="q-mr-sm"
        />
        {{ cell.row.type }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getRoles } from 'src/composables/LetoModelizerApi';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'name',
  required: true,
  label: t('RolesTable.text.nameColumn'),
  align: 'left',
  field: 'name',
  classes: 'role-name',
}, {
  name: 'type',
  required: true,
  label: t('RolesTable.text.typeColumn'),
  align: 'left',
  field: 'type',
  classes: 'role-type',
}]);
const roles = ref([]);
const rowKey = ref('objectId');

/**
 * Get roles from api and add corresponding type.
 * @returns {Promise<Array>} Promise with roles on success otherwise an error.
 */
async function getRolesWithType() {
  return getRoles().then((response) => response.data.results.map((role) => {
    if (role.name.startsWith('lib_')) {
      role.type = t('RolesTable.text.typeColumnLibrary');
      role.color = 'blue';
    } else if (role.name.startsWith('CF_') || role.name === 'admin') {
      role.type = t('RolesTable.text.typeColumnSystem');
      role.color = 'orange';
    } else {
      role.type = t('RolesTable.text.typeColumnFunctional');
      role.color = 'teal';
    }

    return role;
  }));
}

onMounted(async () => {
  roles.value = await getRolesWithType();
});
</script>
