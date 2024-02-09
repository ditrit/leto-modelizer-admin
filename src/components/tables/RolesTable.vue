<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    :pagination="pagination"
    :columns="columns"
    :rows="roles"
    row-key="id"
    data-cy="roles_table"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  roles: {
    type: Array,
    required: true,
  },
});

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
}]);
</script>
