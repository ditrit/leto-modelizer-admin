<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    :pagination="pagination"
    :columns="columns"
    :rows="libraries"
    :row-key="rowKey"
    data-cy="page_libraries_table"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getLibraries } from 'src/composables/LetoModelizerApi';

const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'name',
  required: true,
  label: 'Name',
  align: 'left',
  field: 'name',
}]);
const libraries = ref([]);
const rowKey = ref('objectId');

onMounted(async () => {
  await getLibraries().then((response) => {
    libraries.value = response.data.results;
  });
});
</script>
