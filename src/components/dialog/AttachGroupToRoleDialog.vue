<template>
  <q-dialog v-model="show">
    <q-card class="attach-group-to-role-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachGroupToRoleDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachGroupToRoleDialog.icon.info')"
          />
          <span>
            {{ $t('AttachGroupToRoleDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <groups-table
            v-model:selected="selected"
            :groups="groups"
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
            :label="$t('AttachGroupToRoleDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachGroupToRoleDialog.text.confirm')"
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
import { useDialog } from 'src/composables/Dialog';
import { ref } from 'vue';
import GroupsTable from 'src/components/tables/GroupsTable.vue';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const roleId = ref('');
const selected = ref([]);
const groups = ref([]);

/**
 * Get all groups.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return GroupService.find().then((data) => {
    groups.value = data.content;
  });
}

const { show } = useDialog('attach-group-to-role', (event) => {
  submitting.value = false;
  roleId.value = event.roleId;
  selected.value = [];
  return search();
});

/**
 * Attach one or more groups to a role.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  const groupIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(groupIdList
    .map((groupId) => RoleService.associateRoleAndGroup(groupId, roleId.value)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachGroupToRoleDialog.text.notifyError'),
          html: true,
        });

        throw new Error(groupId);
      })))
    .then((results) => {
      const failedRequestObjects = [];

      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          failedRequestObjects.push(...selected.value
            .filter(({ id }) => id === reason.message));
        }
      });

      selected.value = failedRequestObjects;

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachGroupToRoleDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    })
    .finally(async () => {
      ReloadGroupsEvent.next();
      ReloadPermissionsEvent.next();
      submitting.value = false;
      userStore.permissions = await UserService.getMyPermissions();
    });
}
</script>

<style scoped>
.attach-role-to-group-form {
  min-width: 50vw;
}
</style>
