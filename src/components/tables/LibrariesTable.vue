<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    :pagination="pagination"
    :columns="columns"
    :rows="libraries"
    row-key="objectId"
    data-cy="libraries_table"
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
          :data-cy="`library_${props.row.objectId}_button_show`"
          @click="$emit('show', props.row.objectId)"
        />
        <q-btn
          dense
          flat
          rounded
          color="negative"
          icon="fa-solid fa-trash"
          :data-cy="`library_${props.row.objectId}_button_remove`"
          @click="$emit('remove', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as LibraryService from 'src/services/LibraryService';
import { useI18n } from 'vue-i18n';
import ReloadLibrariesEvent from 'src/composables/events/ReloadLibrariesEvent';

defineEmits(['remove', 'show']);

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'name',
  required: true,
  label: t('LibrariesTable.text.nameColumn'),
  align: 'left',
  field: 'name',
  classes: 'library-name',
}, {
  name: 'actions',
  required: true,
  label: t('LibrariesTable.text.actionsColumn'),
  align: 'left',
  field: 'objectId',
  classes: 'library-actions',
}]);
const libraries = ref([]);

let reloadLibrariesEventRef;

/**
 * Search and display libraries.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return LibraryService.find().then((data) => {
    libraries.value = data;
  });
}

onMounted(async () => {
  reloadLibrariesEventRef = ReloadLibrariesEvent.subscribe(search);
  await search();
});
onUnmounted(() => {
  reloadLibrariesEventRef.unsubscribe();
});
</script>
