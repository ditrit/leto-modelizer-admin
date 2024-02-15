<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('DetachRoleFromUserDialog.text.title', { role: role.name, user: user.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
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
                :name="$t('DetachRoleFromUserDialog.icon.warning')"
                color="white"
              />
            </template>
            {{ $t("DetachRoleFromUserDialog.text.warning") }}
          </q-banner>
        </q-card-section>
        <q-card-section
          v-else
          class="column flex-center"
        >
          {{ $t('DetachRoleFromUserDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('DetachRoleFromUserDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('DetachRoleFromUserDialog.text.confirm')"
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
import { useDialog } from 'src/composables/Dialog';
import { ref, computed } from 'vue';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const role = ref(null);
const user = ref();
const isCurrentUser = computed(() => user.value?.login === userStore.login);
const { show } = useDialog('detach-role-from-user', (event) => {
  submitting.value = false;
  role.value = event.role;
  user.value = event.user;
});

/**
 * Detach role, send event to reload roles and close dialog.
 * If current user loses his admin access, open dialog redirect to Leto-Modelizer.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  await RoleService.dissociateRoleAndUser(user.value.login, role.value.id)
    .then(async () => {
      submitting.value = false;

      Notify.create({
        type: 'positive',
        message: t('DetachRoleFromUserDialog.text.notifySuccess'),
        html: true,
      });

      if (isCurrentUser.value) {
        userStore.permissions = await UserService.getMyPermissions();

        if (!userStore.isAdmin) {
          DialogEvent.next({
            key: 'redirect',
            type: 'open',
          });
        }
      }

      if (!isCurrentUser.value || (isCurrentUser.value && userStore.isAdmin)) {
        ReloadRolesEvent.next();
      }

      show.value = false;
    });
}
</script>
