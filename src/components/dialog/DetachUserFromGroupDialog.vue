<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachUserFromGroupDialog.text.title',
                { user: user.name, group: group.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="detach">
        <q-card-section class="column flex-center">
          {{ $t('DetachUserFromGroupDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachUserFromGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachUserFromGroupDialog.text.confirm')"
            :loading="submitting"
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
import { useDetachDialog } from 'src/composables/DetachDialog';

const {
  show,
  submitting,
  user,
  group,
  detach,
} = useDetachDialog(
  'DetachUserFromGroupDialog',
  'detach-user-from-group',
  'group',
  'user',
);
</script>
