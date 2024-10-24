<template>
  <div>
    <div
      class="row items-center"
    >
      <slot name="header" />
      <secret-filters-card
        v-if="!hideFilters"
        :secret-key="filterKey"
        class="q-mb-md"
        @update:secret-key="setFilterKey"
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
      :pagination="pagination"
      :columns="columns"
      :rows="secrets"
      row-key="id"
      hide-pagination
      :loading="loading"
      class="shadow-5"
      table-header-class="bg-grey-3"
      data-cy="secrets_table"
    >
      <template #body-cell-actions="cell">
        <q-td
          key="actions"
          :props="cell"
        >
          <q-btn
            v-if="editAction"
            dense
            flat
            rounded
            color="primary"
            :icon="t('SecretsTable.icon.editAction')"
            :title="t('SecretsTable.text.editAction')"
            :data-cy="`user_${cell.row.key}_button_edit`"
            @click="$emit('edit', cell.row)"
          />
          <q-btn
            v-if="removeAction"
            dense
            flat
            rounded
            color="negative"
            :icon="t('SecretsTable.icon.removeAction')"
            :title="t('SecretsTable.text.removeAction')"
            :data-cy="`user_${cell.row.key}_button_remove`"
            @click="$emit('remove', cell.row)"
          />
        </q-td>
      </template>
      <template #no-data>
        <div
          class="full-width row flex-center q-gutter-sm"
          data-cy="secrets_table_no_data"
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
import SecretFiltersCard from 'components/card/SecretFiltersCard.vue';

const emits = defineEmits([
  'remove',
  'edit',
  'onFilter',
  'update:filter-key',
  'update:current-page',
  'update:elements-per-page',
]);
const props = defineProps({
  secrets: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  editAction: {
    type: Boolean,
    default: true,
  },
  removeAction: {
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
  filterKey: {
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
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const displayActionsColumn = computed(
  () => props.editAction || props.removeAction,
);
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'key',
    required: true,
    label: t('SecretsTable.text.keyColumn'),
    align: 'left',
    field: 'key',
    classes: 'secret-key',
  }, {
    name: 'updateDate',
    required: true,
    label: t('SecretsTable.text.updateDateColumn'),
    align: 'left',
    field: 'updateDate',
    format: (value) => new Date(value).toLocaleString(),
    classes: 'secret-updateDate',
  }];

  if (displayActionsColumn.value) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t('SecretsTable.text.actionsColumn'),
      align: 'left',
      field: 'id',
      classes: 'secret-actions',
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
 * Emit events to update secret filterName props.
 * @param {string} value - Secret nameFilter value;
 */
function setFilterKey(value) {
  emits('update:filter-key', value);
  emits('onFilter');
}

</script>
