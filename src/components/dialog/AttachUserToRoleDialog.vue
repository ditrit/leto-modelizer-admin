<template>
  <q-dialog v-model="show">
    <q-card class="attach-user-to-role-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachUserToRoleDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="attach">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachUserToRoleDialog.icon.info')"
          />
          <span>
            {{ $t('AttachUserToRoleDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <users-table
            v-model:selected="selected"
            :users="users"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            :no-data-label="$t('UsersTable.text.noData')"
            :no-data-icon="$t('UsersTable.icon.noData')"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachUserToRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachUserToRoleDialog.text.confirm')"
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
import { useAttachDialog } from 'src/composables/AttachDialog';

const users = ref([]);

/**
 * Get all users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserService.find().then((data) => {
    users.value = data.content;
  });
}

const {
  show,
  submitting,
  selected,
  attach,
} = useAttachDialog(
  'AttachUserToRoleDialog',
  'attach-user-to-role',
  'role',
  'user',
  search,
);
</script>

<style scoped>
.attach-user-to-role-form {
  min-width: 50vw;
}
</style>
