<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    :pagination="pagination"
    :columns="columns"
    :rows="libraries"
    row-key="id"
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
          :icon="t('LibrariesTable.icon.showAction')"
          :title="t('LibrariesTable.text.showAction')"
          :data-cy="`library_${props.row.id}_button_show`"
          @click="$emit('show', props.row.id)"
        />
        <q-btn
          dense
          flat
          rounded
          color="negative"
          :icon="t('LibrariesTable.icon.removeAction')"
          :title="t('LibrariesTable.text.removeAction')"
          :data-cy="`library_${props.row.id}_button_remove`"
          @click="$emit('remove', props.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon
          size="2em"
          :name="$t('LibrariesTable.icon.noData')"
        />
        <span>
          {{ $t('LibrariesTable.text.noData') }}
        </span>
      </div>
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
  field: 'id',
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
    libraries.value = data.content;
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
