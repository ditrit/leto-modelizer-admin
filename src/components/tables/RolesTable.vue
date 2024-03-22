<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-pagination
    :columns="columns"
    :rows="roles"
    row-key="id"
    data-cy="roles_table"
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
          :icon="t('RolesTable.icon.showAction')"
          :title="t('RolesTable.text.showAction')"
          :data-cy="`role_${cell.row.id}_button_show`"
          @click="$emit('show', cell.row.id)"
        />
        <q-btn
          v-if="detachAction"
          dense
          flat
          rounded
          color="negative"
          :icon="t('RolesTable.icon.detachAction')"
          :title="t('RolesTable.text.detachAction')"
          :data-cy="`role_${cell.row.id}_button_detach`"
          @click="$emit('detach', cell.row)"
        />
        <q-btn
          v-if="removeAction"
          dense
          flat
          rounded
          color="negative"
          :icon="t('RolesTable.icon.removeAction')"
          :title="t('RolesTable.text.removeAction')"
          :data-cy="`role_${cell.row.id}_button_remove`"
          @click="$emit('remove', cell.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon
          size="2em"
          :name="$t('RolesTable.icon.noData')"
        />
        <span>
          {{ $t('RolesTable.text.noData') }}
        </span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineEmits(['remove', 'show', 'detach']);
const props = defineProps({
  roles: {
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
const displayActionsColumn = computed(
  () => props.showAction || props.removeAction || props.detachAction,
);
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'name',
    required: true,
    label: t('RolesTable.text.nameColumn'),
    align: 'left',
    field: 'name',
    classes: 'role-name',
  }];

  if (displayActionsColumn.value) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t('RolesTable.text.actionsColumn'),
      align: 'left',
      field: 'id',
      classes: 'role-actions',
    });
  }

  return arrayOfColumns;
});
</script>
