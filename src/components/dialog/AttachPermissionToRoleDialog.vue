<template>
  <q-dialog v-model="show">
    <q-card class="attach-permission-to-role-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachPermissionToRoleDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="attach">
        <q-card-section>
          <permissions-table
            v-model:selected="selected"
            :permissions="permissions"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachPermissionToRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachPermissionToRoleDialog.text.confirm')"
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
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';
import * as PermissionService from 'src/services/PermissionService';
import { useAttachDialog } from 'src/composables/AttachDialog';

const permissions = ref([]);

/**
 * Get all permissions.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return PermissionService.find().then((data) => {
    permissions.value = data.content;
  });
}

const {
  show,
  submitting,
  selected,
  attach,
} = useAttachDialog(
  'AttachPermissionToRoleDialog',
  'attach-permission-to-role',
  'role',
  'permission',
  search,
);
</script>

<style scoped>
.attach-permission-to-role-form {
  min-width: 60vw;
}
</style>
