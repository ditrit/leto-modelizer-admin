<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachUserFromRoleDialog.text.title', { user: user.name, role: role.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="detach">
        <q-card-section
          v-if="isCurrentUser"
          class="column flex-center"
          data-cy="remove_current_user_warning"
        >
          <q-banner
            class="bg-negative text-white text-weight-bold"
          >
            <template #avatar>
              <q-icon
                :name="$t('DetachUserFromRoleDialog.icon.warning')"
                color="white"
              />
            </template>
            {{ $t("DetachUserFromRoleDialog.text.warning") }}
          </q-banner>
        </q-card-section>
        <q-card-section
          v-else
          class="column flex-center"
        >
          {{ $t('DetachUserFromRoleDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachUserFromRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachUserFromRoleDialog.text.confirm')"
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
  role,
  isCurrentUser,
  detach,
} = useDetachDialog(
  'DetachUserFromRoleDialog',
  'detach-user-from-role',
  'role',
  'user',
);
</script>
