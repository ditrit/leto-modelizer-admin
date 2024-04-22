<template>
  <div>
    <div
      class="row items-center"
    >
      <slot name="header" />
      <access-control-filters-card
        v-if="!hideFilters"
        :access-control-type="accessControlType"
        :name="filterName"
        class="q-mb-md"
        @update:name="setFilterName"
      />
      <q-space />
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
      class="shadow-5"
      table-header-class="bg-grey-3"
      hide-pagination
      :columns="columns"
      :rows="rows"
      row-key="id"
      :loading="loading"
      :data-cy="`${accessControlType}s_table`"
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
            :icon="t(`${translationKey}sTable.icon.showAction`)"
            :title="t(`${translationKey}sTable.text.showAction`)"
            :data-cy="`${accessControlType}_${cell.row.id}_button_show`"
            @click="$emit('show', cell.row.id)"
          />
          <q-btn
            v-if="detachAction"
            dense
            flat
            rounded
            color="negative"
            :icon="t(`${translationKey}sTable.icon.detachAction`)"
            :title="t(`${translationKey}sTable.text.detachAction`)"
            :data-cy="`${accessControlType}_${cell.row.id}_button_detach`"
            @click="$emit('detach', cell.row)"
          />
          <q-btn
            v-if="removeAction"
            dense
            flat
            rounded
            color="negative"
            :icon="t(`${translationKey}sTable.icon.removeAction`)"
            :title="t(`${translationKey}sTable.text.removeAction`)"
            :data-cy="`${accessControlType}_${cell.row.id}_button_remove`"
            @click="$emit('remove', cell.row)"
          />
        </q-td>
      </template>
      <template #no-data>
        <div
          class="full-width row flex-center q-gutter-sm"
          :data-cy="`${accessControlType}s_table_no_data`"
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
import AccessControlFiltersCard from 'components/card/AccessControlFiltersCard.vue';

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
  accessControlType: {
    type: String,
    required: true,
  },
  rows: {
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
  hideFilters: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const displayActionsColumn = computed(
  () => props.showAction || props.removeAction || props.detachAction,
);
const translationKey = computed(() => (props.accessControlType === 'role' ? 'Role' : 'Group'));
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'name',
    required: true,
    label: t(`${translationKey.value}sTable.text.nameColumn`),
    align: 'left',
    field: 'name',
    classes: `${props.accessControlType}-name`,
  }];

  if (displayActionsColumn.value) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t(`${translationKey.value}sTable.text.actionsColumn`),
      align: 'left',
      field: 'id',
      classes: `${props.accessControlType}-actions`,
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
 * Emit events to update filterName props.
 * @param {string} value - NameFilter value;
 */
function setFilterName(value) {
  emits('update:filter-name', value);
  emits('onFilter');
}
</script>
