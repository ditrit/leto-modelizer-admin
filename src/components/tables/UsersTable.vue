<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    hide-bottom
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
          icon="fa-solid fa-pen-to-square"
          :data-cy="`user_${cell.row.login}_button_show`"
          @click="$emit('show', cell.row.login)"
        />
        <q-btn
          v-if="removeAction"
          dense
          flat
          rounded
          color="negative"
          icon="fa-solid fa-trash"
          :data-cy="`user_${cell.row.login}_button_remove`"
          @click="$emit('remove', cell.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UserAvatar from 'src/components/avatar/UserAvatar.vue';

defineEmits(['remove', 'show']);
const props = defineProps({
  users: {
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
      label: t('GroupsTable.text.actionsColumn'),
      align: 'left',
      field: 'login',
      classes: 'group-actions',
    });
  }

  return arrayOfColumns;
});
</script>
