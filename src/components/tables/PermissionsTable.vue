<template>
  <div>
    <div
      class="row justify-between items-center"
    >
      <permission-filters-card
        :entity="filterEntity"
        :action="filterAction"
        :library-id="filterLibraryId"
        class="q-mb-md"
        @update:entity="setFilterEntity"
        @update:action="setFilterAction"
        @update:library-id="setFilterLibraryId"
      />
      <table-pagination-card
        :current="currentPage"
        :max="maxPage"
        :total="totalElements"
        :size="elementsPerPage"
        class="q-mb-md"
        @update:current="setCurrentPage"
        @update:size="setElementsPerPage"
      />
    </div>
    <q-table
      v-bind="$attrs"
      :pagination="pagination"
      :columns="columns"
      :rows="permissions"
      hide-pagination
      row-key="id"
      :loading="loading"
      class="shadow-5"
      table-header-class="bg-grey-3"
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
        <div
          class="full-width row flex-center q-gutter-sm"
          data-cy="permissions_table_no_data"
        >
          <q-icon
            v-if="noDataIcon"
            size="2em"
            :name="noDataIcon"
          />
          <span v-if="noDataLabel">
            {{ noDataLabel }}
          </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TablePaginationCard from 'components/card/TablePaginationCard.vue';
import PermissionFiltersCard from 'components/card/PermissionFiltersCard.vue';

const emits = defineEmits([
  'detach',
  'onFilter',
  'update:filter-entity',
  'update:filter-action',
  'update:filter-library-id',
  'update:current-page',
  'update:elements-per-page',
]);
const props = defineProps({
  permissions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  detachAction: {
    type: Boolean,
    default: true,
  },
  noDataLabel: {
    type: String,
    default: null,
  },
  noDataIcon: {
    type: String,
    default: null,
  },
  filterEntity: {
    type: String,
    default: '',
  },
  filterAction: {
    type: String,
    default: '',
  },
  filterLibraryId: {
    type: String,
    default: '',
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  maxPage: {
    type: Number,
    default: 0,
  },
  elementsPerPage: {
    type: Number,
    default: 10,
  },
  totalElements: {
    type: Number,
    default: 0,
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

/**
 * Emit events to update currentPage props.
 * @param {number} value - Current page value;
 */
function setCurrentPage(value) {
  emits('update:current-page', value);
  emits('onFilter');
}

/**
 * Emit events to update elementsPerPage props.
 * @param {number} value - Elements per page value;
 */
function setElementsPerPage(value) {
  emits('update:elements-per-page', value);
  emits('onFilter');
}

/**
 * Emit events to update permission filterEntity props.
 * @param {string} value - Permission entityFilter value;
 */
function setFilterEntity(value) {
  emits('update:filter-entity', value);
  emits('onFilter');
}

/**
 * Emit events to update permission filterAction props.
 * @param {string} value - Permission actionFilter value;
 */
function setFilterAction(value) {
  emits('update:filter-action', value);
  emits('onFilter');
}

/**
 * Emit events to update permission filterLibraryId props.
 * @param {string} value - Permission libraryIdFilter value;
 */
function setFilterLibraryId(value) {
  emits('update:filter-library-id', value);
  emits('onFilter');
}
</script>
