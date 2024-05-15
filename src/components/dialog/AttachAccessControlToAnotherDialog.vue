<template>
  <q-dialog v-model="show">
    <q-card class="attach-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t(`${translationKey}Dialog.text.title`) }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <access-control-table
            v-model:selected="selected"
            v-model:filter-name="filters.name"
            v-model:current-page="filters.page"
            v-model:max-page="maxPage"
            v-model:elements-per-page="filters.count"
            v-model:total-elements="totalElements"
            :access-control-type="accessControlType"
            :rows="rows"
            :show-action="false"
            :remove-action="false"
            :detach-action="false"
            :no-data-label="$t('RolesTable.text.noData')"
            :no-data-icon="$t('RolesTable.icon.noData')"
            selection="multiple"
            class="full-width"
            @on-filter="search"
          />
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
import { ref, computed } from 'vue';
import AccessControlTable from 'src/components/tables/AccessControlTable.vue';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import SelectEvent from 'src/composables/events/SelectEvent';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
// import { getAccessControlFilters } from 'src/composables/FiltersArray';
import { accessControlFilters } from 'src/composables/FiltersArray';

const { t } = useI18n();
const userStore = useUserStore();
const submitting = ref(false);
const accessControl = ref({});
const accessControlType = ref();
const targetAccessControlType = ref();
const selectOnly = ref(false);
const selected = ref([]);
const rows = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const superAdministratorId = ref('');
const translationKey = computed(() => {
  if (accessControlType.value === 'role') {
    return targetAccessControlType.value === 'role' ? 'AttachRoleToRole' : 'AttachRoleToGroup';
  }

  return targetAccessControlType.value === 'role' ? 'AttachGroupToRole' : 'AttachGroupToGroup';
});
const {
  filters,
  getFilters,
} = useServerSideFilter(accessControlFilters);
// } = useServerSideFilter(getAccessControlFilters());

/**
 * Get ID of role SUPER_ADMINISTRATOR.
 */
async function getSuperAdministratorId() {
  await RoleService.find({
    name: 'SUPER_ADMINISTRATOR',
  }).then(({ content }) => {
    superAdministratorId.value = content[0].id;
  });
}

/**
 * Load groups and invoke the appropriate method from GroupService based on the target.
 * @returns {object} Object that contains group filters.
 */
async function loadGroups() {
  if (targetAccessControlType.value === 'group') {
    return GroupService.find({
      id: `not_${accessControl.value.id}`,
      ...getFilters(),
    });
  }

  return GroupService.find(getFilters());
}

/**
 * Load roles and invoke the appropriate method from RoleService based on the entity value.
 * @returns {object} Object that contains role filters.
 */
async function loadRoles() {
  if (targetAccessControlType.value === 'role') {
    return RoleService.find({
      id: `not_${superAdministratorId.value}`,
      ...getFilters(),
    });
  }

  return RoleService.find({
    id: `not_${superAdministratorId.value}`,
    ...getFilters(),
  });
}

/**
 * Set rows value.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  const promise = accessControlType.value === 'group' ? loadGroups : loadRoles;

  return promise().then((data) => {
    rows.value = data.content;
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;
  });
}

const { show } = useDialog('attach-access-control', async (event) => {
  submitting.value = false;
  selected.value = [];
  selectOnly.value = event.selectOnly || false;
  accessControl.value = event.accessControl;
  accessControlType.value = event.accessControlType;
  targetAccessControlType.value = event.targetAccessControlType;

  await getSuperAdministratorId();

  return search();
});

/**
 * Attach an access control entity to another entity based on specified conditions.
 * @param {string} accessControlIdToAttach - The ID of the access control entity to attach.
 * @returns {Promise<any>} A promise with the result of attaching the access control entity.
 */
async function attachAccessControl(accessControlIdToAttach) {
  if (accessControlType.value === 'group' && targetAccessControlType.value === 'group') {
    return GroupService.associateGroupAndGroup(accessControlIdToAttach, accessControl.value.id);
  }

  if (accessControlType.value === 'group') {
    return RoleService.associateRoleAndGroup(accessControlIdToAttach, accessControl.value.id);
  }

  if (targetAccessControlType.value === 'role') {
    return RoleService.associateRoleAndRole(accessControl.value.id, accessControlIdToAttach);
  }

  return RoleService.associateRoleAndGroup(accessControl.value.id, accessControlIdToAttach);
}

/**
 * Attach one or more groups/roles to another groups/roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  if (selectOnly.value) {
    SelectEvent.SelectRolesEvent.next(selected.value);
    show.value = false;

    return;
  }

  submitting.value = true;

  const accessControlIdList = selected.value.map(({ id }) => id);

  await Promise.allSettled(accessControlIdList
    .map((accessControlId) => attachAccessControl(accessControlId)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t(`${translationKey.value}Dialog.text.notifyError`),
          html: true,
        });

        throw new Error(accessControlId);
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
          message: t(`${translationKey.value}Dialog.text.notifySuccess`),
          html: true,
        });

        show.value = false;
      }
    })
    .finally(async () => {
      if (accessControlType.value === 'group') {
        ReloadGroupsEvent.next();
      } else {
        ReloadRolesEvent.next();
      }

      ReloadPermissionsEvent.next();
      userStore.permissions = await UserService.getMyPermissions();
      submitting.value = false;
    });
}
</script>

<style scoped>
.attach-form {
  min-width: 50vw;
}
</style>
