<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    row-key="id"
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
          :icon="t('GroupsTable.icon.showAction')"
          :title="t('GroupsTable.text.showAction')"
          :data-cy="`group_${cell.row.id}_button_show`"
          @click="$emit('show', cell.row.id)"
        />
        <q-btn
          v-if="detachAction"
          dense
          flat
          rounded
          color="negative"
          :icon="t('GroupsTable.icon.detachAction')"
          :title="t('GroupsTable.text.detachAction')"
          :data-cy="`group_${cell.row.id}_button_detach`"
          @click="$emit('detach', cell.row)"
        />
        <q-btn
          v-if="removeAction"
          dense
          flat
          rounded
          color="negative"
          :icon="t('GroupsTable.icon.removeAction')"
          :title="t('GroupsTable.text.removeAction')"
          :data-cy="`group_${cell.row.id}_button_remove`"
          @click="$emit('remove', cell.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon
          size="2em"
          :name="$t('GroupsTable.icon.noData')"
        />
        <span>
          {{ $t('GroupsTable.text.noData') }}
        </span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineEmits(['remove', 'show', 'detach']);
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
  detachAction: {
    type: Boolean,
    default: true,
  },
});

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const displayActionsColumn = computed(
  () => props.showAction || props.removeAction || props.detachAction,
);
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
      field: 'id',
      classes: 'group-actions',
    });
  }
  return arrayOfColumns;
});
</script>
