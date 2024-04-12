<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t(`${translationKey}Dialog.text.title`,
                { accessControlToDetach: targetAccessControl.name,
                  accessControl: accessControl.name }) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="column flex-center">
          {{ $t(`${translationKey}Dialog.text.content`) }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t(`${translationKey}Dialog.text.cancel`)"
            color="negative"
          />
          <q-btn
            :label="$t(`${translationKey}Dialog.text.confirm`)"
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
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const { t } = useI18n();
const userStore = useUserStore();
const submitting = ref(false);
const accessControl = ref({});
const accessControlType = ref();
const targetAccessControl = ref({});
const targetAccessControlType = ref();
const translationKey = computed(() => {
  if (accessControlType.value === 'role') {
    return targetAccessControlType.value === 'role' ? 'DetachRoleFromRole' : 'DetachRoleFromGroup';
  }

  return targetAccessControlType.value === 'role' ? 'DetachGroupFromRole' : 'DetachGroupFromGroup';
});

const { show } = useDialog('detach-access-control', (event) => {
  submitting.value = false;
  accessControl.value = event.accessControl;
  accessControlType.value = event.accessControlType;
  targetAccessControl.value = event.targetAccessControl;
  targetAccessControlType.value = event.targetAccessControlType;
});

/**
 * Detach an access control entity from another entity based on specified conditions.
 * @returns {Promise<any>} A promise with the result of attaching the access control entity.
 */
async function detachAccessControl() {
  if (accessControlType.value === 'group' && targetAccessControlType.value === 'group') {
    return GroupService.dissociateGroupAndGroup(
      targetAccessControl.value.id,
      accessControl.value.id,
    );
  }

  if (accessControlType.value === 'group') {
    return RoleService.dissociateRoleAndGroup(targetAccessControl.value.id, accessControl.value.id);
  }

  if (targetAccessControlType.value === 'role') {
    return RoleService.dissociateRoleAndRole(accessControl.value.id, targetAccessControl.value.id);
  }

  return RoleService.dissociateRoleAndGroup(accessControl.value.id, targetAccessControl.value.id);
}

/**
 * Attach one or more groups/roles to another groups/roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;

  // TODO: generic error management
  await detachAccessControl();

  Notify.create({
    type: 'positive',
    message: t(`${translationKey.value}Dialog.text.notifySuccess`),
    html: true,
  });

  if (accessControlType.value === 'group') {
    ReloadGroupsEvent.next();
  } else {
    ReloadRolesEvent.next();
  }
  ReloadPermissionsEvent.next();

  userStore.permissions = await UserService.getMyPermissions();

  submitting.value = false;
  show.value = false;
}
</script>

<style scoped>
.attach-form {
  min-width: 50vw;
}
</style>
