<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    row-key="id"
    :pagination="pagination"
    :columns="columns"
    :rows="permissions"
    data-cy="permissions_table"
  >
    <template #body-cell-entity="cell">
      <q-td
        key="entity"
        :props="cell"
      >
        {{ t(`Permissions.text.${cell.row.entity}`) }}
      </q-td>
    </template>
    <template #body-cell-action="cell">
      <q-td
        key="action"
        :props="cell"
      >
        {{ t(`Permissions.text.${cell.row.action}`) }}
      </q-td>
    </template>
    <template #body-cell-key="cell">
      <q-td
        key="key"
        :props="cell"
      >
        <div>
          {{ t(`Permissions.text.${cell.row.key}`) }}
        </div>
        <a
          v-if="cell.row.libraryId"
          :href="`/libraries/${cell.row.libraryId}`"
          data-cy="more_info_library"
        >
          {{ t('Permissions.text.libraryInfo') }}
        </a>
      </q-td>
    </template>
    <template #body-cell-actions="cell">
      <q-td
        key="actions"
        :props="cell"
      >
        <q-btn
          v-if="detachAction"
          dense
          flat
          rounded
          color="negative"
          :icon="t('PermissionsTable.icon.detachAction')"
          :title="t('PermissionsTable.text.detachAction')"
          :data-cy="`permission_${cell.row.id}_button_detach`"
          @click="$emit('detach', cell.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon
          size="2em"
          :name="$t('PermissionsTable.icon.noData')"
        />
        <span>
          {{ $t('PermissionsTable.text.noData') }}
        </span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineEmits(['detach']);
const props = defineProps({
  permissions: {
    type: Array,
    required: true,
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
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'entity',
    required: true,
    label: t('PermissionsTable.text.entityColumn'),
    align: 'left',
    field: 'entity',
    classes: 'permission-entity',
  }, {
    name: 'action',
    required: true,
    label: t('PermissionsTable.text.actionColumn'),
    align: 'left',
    field: 'action',
    classes: 'permission-action',
  }, {
    name: 'key',
    required: true,
    label: t('PermissionsTable.text.keyColumn'),
    align: 'left',
    field: 'key',
    classes: 'permission-key',
  }];

  if (props.detachAction) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t('PermissionsTable.text.actionsColumn'),
      align: 'left',
      field: 'id',
      classes: 'permission-actions',
    });
  }

  return arrayOfColumns;
});
</script>
