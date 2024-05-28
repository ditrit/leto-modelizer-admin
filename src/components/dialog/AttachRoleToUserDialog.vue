<template>
  <q-dialog v-model="show">
    <q-card class="attach-role-to-user-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachRoleToUserDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="attach">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachRoleToUserDialog.icon.info')"
          />
          <span>
            {{ $t('AttachRoleToUserDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <access-control-table
            v-model:selected="selected"
            access-control-type="role"
            :rows="roles"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            :no-data-label="$t('RolesTable.text.noData')"
            :no-data-icon="$t('RolesTable.icon.noData')"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachRoleToUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachRoleToUserDialog.text.confirm')"
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
import AccessControlTable from 'src/components/tables/AccessControlTable.vue';
import * as RoleService from 'src/services/RoleService';
import { useAttachDialog } from 'src/composables/AttachDialog';

const roles = ref([]);

/**
 * Get roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return RoleService.find().then((data) => {
    roles.value = data.content;
  });
}

const {
  show,
  submitting,
  selected,
  attach,
} = useAttachDialog(
  'AttachRoleToUserDialog',
  'attach-role-to-user',
  'user',
  'role',
  search,
);
</script>

<style scoped>
.attach-role-to-user-form {
  min-width: 50vw;
}
</style>
