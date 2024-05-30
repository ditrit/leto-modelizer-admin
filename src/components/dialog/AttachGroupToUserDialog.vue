<template>
  <q-dialog v-model="show">
    <q-card class="attach-group-to-user-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachGroupToUserDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="attach">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachGroupToUserDialog.icon.info')"
          />
          <span>
            {{ $t('AttachGroupToUserDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <access-control-table
            v-model:selected="selected"
            access-control-type="group"
            :rows="groups"
            :show-action="false"
            :detach-action="false"
            :remove-action="false"
            selection="multiple"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachGroupToUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachGroupToUserDialog.text.confirm')"
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
import * as GroupService from 'src/services/GroupService';
import { useAttachDialog } from 'src/composables/AttachDialog';

const groups = ref([]);

/**
 * Get groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return GroupService.find().then((data) => {
    groups.value = data.content;
  });
}

const {
  show,
  submitting,
  selected,
  attach,
} = useAttachDialog(
  'AttachGroupToUserDialog',
  'attach-group-to-user',
  'user',
  'group',
  search,
);
</script>

<style scoped>
.attach-group-to-user-form {
  min-width: 50vw;
}
</style>
