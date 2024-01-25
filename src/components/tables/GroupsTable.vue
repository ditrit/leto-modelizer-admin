<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
    row-key="objectId"
    :pagination="pagination"
    :columns="columns"
    :rows="groups"
    data-cy="groups_table"
  >
    <template #body-cell-actions="cell">
      <q-td
        key="actions"
        :props="cell"
      >
        <q-btn
          v-if="showAction"
          dense
          flat
          rounded
          color="primary"
          icon="fa-solid fa-pen-to-square"
          :data-cy="`group_${cell.row.objectId}_button_show`"
          @click="$emit('show', cell.row.objectId)"
        />
        <q-btn
          v-if="removeAction"
          dense
          flat
          rounded
          color="negative"
          icon="fa-solid fa-trash"
          :data-cy="`group_${cell.row.objectId}_button_remove`"
          @click="$emit('remove', cell.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineEmits(['remove', 'show']);
const props = defineProps({
  groups: {
    type: Array,
    required: true,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  removeAction: {
    type: Boolean,
    default: true,
  },
});

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const displayActionsColumn = computed(() => props.showAction || props.removeAction);
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'name',
    required: true,
    label: t('GroupsTable.text.nameColumn'),
    align: 'left',
    field: 'name',
    classes: 'group-name',
  }];

  if (displayActionsColumn.value) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t('GroupsTable.text.actionsColumn'),
      align: 'left',
      field: 'objectId',
      classes: 'group-actions',
    });
  }
  return arrayOfColumns;
});
</script>
