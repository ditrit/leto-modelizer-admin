<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    row-key="login"
    :pagination="pagination"
    :columns="columns"
    :rows="users"
    data-cy="users_table"
  >
    <template #body-cell-name="cell">
      <q-td
        :props="cell"
      >
        <user-avatar
          :login="cell.row.login"
          small
        />
        <span class="q-pl-md">
          {{ cell.row.name }}
        </span>
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
      <div class="full-width row flex-center q-gutter-sm">
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UserAvatar from 'src/components/avatar/UserAvatar.vue';

defineEmits(['remove', 'show', 'detach']);
const props = defineProps({
  users: {
    type: Array,
    required: true,
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
</script>
