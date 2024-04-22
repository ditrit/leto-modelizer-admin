<template>
  <div>
    <div
      class="row items-center"
    >
      <slot name="header" />
      <user-filters-card
        v-if="!hideFilters"
        :name="filterName"
        :login="filterLogin"
        :email="filterEmail"
        class="q-mb-md"
        @update:name="setFilterName"
        @update:login="setFilterLogin"
        @update:email="setFilterEmail"
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
      :rows="users"
      row-key="login"
      hide-pagination
      :loading="loading"
      class="shadow-5"
      table-header-class="bg-grey-3"
      data-cy="users_table"
    >
      <template #body-cell-avatar="cell">
        <q-td
          :props="cell"
        >
          <user-avatar
            :login="cell.row.login"
            small
          />
        </q-td>
      </template>
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
            :icon="t('UsersTable.icon.showAction')"
            :title="t('UsersTable.text.showAction')"
            :data-cy="`user_${cell.row.login}_button_show`"
            @click="$emit('show', cell.row.login)"
          />
          <q-btn
            v-if="detachAction"
            dense
            flat
            rounded
            color="negative"
            :icon="t('UsersTable.icon.detachAction')"
            :title="t('UsersTable.text.detachAction')"
            :data-cy="`user_${cell.row.login}_button_detach`"
            @click="$emit('detach', cell.row)"
          />
          <q-btn
            v-if="removeAction"
            dense
            flat
            rounded
            color="negative"
            :icon="t('UsersTable.icon.removeAction')"
            :title="t('UsersTable.text.removeAction')"
            :data-cy="`user_${cell.row.login}_button_remove`"
            @click="$emit('remove', cell.row)"
          />
        </q-td>
      </template>
      <template #no-data>
        <div
          class="full-width row flex-center q-gutter-sm"
          data-cy="users_table_no_data"
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
import UserFiltersCard from 'components/card/UserFiltersCard.vue';
import UserAvatar from 'src/components/avatar/UserAvatar.vue';

const emits = defineEmits([
  'remove',
  'show',
  'detach',
  'onFilter',
  'update:filter-name',
  'update:filter-login',
  'update:filter-email',
  'update:current-page',
  'update:elements-per-page',
]);
const props = defineProps({
  users: {
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
  detachAction: {
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
  filterName: {
    type: String,
    default: '',
  },
  filterLogin: {
    type: String,
    default: '',
  },
  filterEmail: {
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
  () => props.showAction || props.removeAction || props.detachAction,
);
const columns = computed(() => {
  const arrayOfColumns = [{
    name: 'avatar',
    required: true,
    label: t('UsersTable.text.avatarColumn'),
    align: 'left',
    field: 'avatar',
    classes: 'user-avatar',
  },
  {
    name: 'name',
    required: true,
    label: t('UsersTable.text.nameColumn'),
    align: 'left',
    field: 'name',
    classes: 'user-name',
  }, {
    name: 'login',
    required: true,
    label: t('UsersTable.text.loginColumn'),
    align: 'left',
    field: 'login',
    classes: 'user-login',
  }, {
    name: 'email',
    required: true,
    label: t('UsersTable.text.emailColumn'),
    align: 'left',
    field: 'email',
    classes: 'user-email',
  }];

  if (displayActionsColumn.value) {
    arrayOfColumns.push({
      name: 'actions',
      required: true,
      label: t('UsersTable.text.actionsColumn'),
      align: 'left',
      field: 'login',
      classes: 'user-actions',
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
 * Emit events to update user filterName props.
 * @param {string} value - User nameFilter value;
 */
function setFilterName(value) {
  emits('update:filter-name', value);
  emits('onFilter');
}

/**
 * Emit events to update user filterLogin props.
 * @param {string} value - User loginFilter value;
 */
function setFilterLogin(value) {
  emits('update:filter-login', value);
  emits('onFilter');
}

/**
 * Emit events to update user filterEmail props.
 * @param {string} value - User emailFilter value;
 */
function setFilterEmail(value) {
  emits('update:filter-email', value);
  emits('onFilter');
}

</script>
