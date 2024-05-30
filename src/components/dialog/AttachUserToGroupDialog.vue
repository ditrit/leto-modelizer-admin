<template>
  <q-dialog v-model="show">
    <q-card class="attach-user-to-group-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachUserToGroupDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="attach">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachUserToGroupDialog.icon.info')"
          />
          <span>
            {{ $t('AttachUserToGroupDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <users-table
            v-model:selected="selected"
            v-model:filter-name="filters.name"
            v-model:filter-login="filters.login"
            v-model:filter-email="filters.email"
            v-model:current-page="filters.page"
            v-model:max-page="maxPage"
            v-model:elements-per-page="filters.count"
            v-model:total-elements="totalElements"
            :users="users"
            :show-action="false"
            :detach-action="false"
            :remove-action="false"
            :no-data-label="$t('UsersTable.text.noData')"
            :no-data-icon="$t('UsersTable.icon.noData')"
            selection="multiple"
            class="full-width"
            @on-filter="search"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachUserToGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachUserToGroupDialog.text.confirm')"
            :loading="submitting"
            :disable="!selected.length"
            type="submit"
            color="positive"
            data-cy="button_confirm"
          >
            <template #loading>
              <q-spinner-hourglass />
            </template>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import UsersTable from 'src/components/tables/UsersTable.vue';
import * as UserService from 'src/services/UserService';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import userFilters from 'src/composables/filters/UserFilters';
import { useAttachDialog } from 'src/composables/AttachDialog';

const users = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const {
  filters,
  getFilters,
} = useServerSideFilter(userFilters);

/**
 * Get users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserService.find(getFilters()).then((data) => {
    users.value = data.content;
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;
  });
}

const {
  show,
  submitting,
  selected,
  attach,
} = useAttachDialog(
  'AttachUserToGroupDialog',
  'attach-user-to-group',
  'group',
  'user',
  search,
);
</script>

<style scoped>
.attach-user-to-group-form {
  min-width: 50vw;
}
</style>
