<template>
  <div>
    <div
      class="row justify-between items-center"
    >
      <role-filters-card
        v-if="!hideFilters"
        :name="filterName"
        class="q-mb-md"
        @update:name="setFilterName"
      />
      <table-pagination-card
        v-if="!hidePagination"
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
      class="shadow-5"
      table-header-class="bg-grey-3"
      hide-pagination
      :columns="columns"
      :rows="roles"
      :loading="loading"
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
        <div
          class="full-width row flex-center q-gutter-sm"
          data-cy="roles_table_no_data"
        >
          <q-icon
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TablePaginationCard from 'components/card/TablePaginationCard.vue';
import RoleFiltersCard from 'components/card/RoleFiltersCard.vue';

const emits = defineEmits([
  'remove',
  'show',
  'detach',
  'onFilter',
  'update:filter-name',
  'update:current-page',
  'update:elements-per-page',
]);
const props = defineProps({
  roles: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
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
  hideFilters: {
    type: Boolean,
    default: false,
  },
  hidePagination: {
    type: Boolean,
    default: false,
  },
  noDataLabel: {
    type: String,
    default: null,
  },
  noDataIcon: {
    type: String,
    default: null,
  },
  filterName: {
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
 * Emit events to update role filterName props.
 * @param {string} value - Role nameFilter value;
 */
function setFilterName(value) {
  emits('update:filter-name', value);
  emits('onFilter');
}

</script>
