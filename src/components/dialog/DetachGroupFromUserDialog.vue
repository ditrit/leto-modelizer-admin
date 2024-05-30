<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachGroupFromUserDialog.text.title',
                { group: group.name, user: user.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="detach">
        <q-card-section class="column flex-center">
          {{ $t('DetachGroupFromUserDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachGroupFromUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachGroupFromUserDialog.text.confirm')"
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
  'DetachGroupFromUserDialog',
  'detach-group-from-user',
  'user',
  'group',
);
</script>
