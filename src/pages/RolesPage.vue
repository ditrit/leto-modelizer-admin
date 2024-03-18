<template>
  <q-page class="column q-pa-md bg-grey-1">
    <h4
      class="q-ma-none q-mt-md q-mb-lg"
      data-cy="page_roles_title"
    >
      {{ $t('RolesPage.text.title') }}
    </h4>
    <roles-table
      :roles="roles"
      :detach-action="false"
      @show="goToRole"
      @remove="openRemoveRoleDialog"
    />
  </q-page>
</template>

<script setup>
import RolesTable from 'src/components/tables/RolesTable.vue';
import * as RoleService from 'src/services/RoleService';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';

const router = useRouter();
const roles = ref([]);
let reloadRolesEventRef;

/**
 * Go to role page.
 * @param {string} id - Role id.
 */
function goToRole(id) {
  router.push(`/roles/${id}`);
}

/**
 * Open dialog to remove role.
 * @param {object} role - Role object to remove for the dialog.
 */
function openRemoveRoleDialog(role) {
  DialogEvent.next({
    key: 'remove-role',
    type: 'open',
    role,
  });
}

/**
 * Search and display roles.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return RoleService.find().then((data) => {
    roles.value = data.content;
  });
}

onMounted(async () => {
  reloadRolesEventRef = ReloadRolesEvent.subscribe(search);

  await search();
});

onUnmounted(() => {
  reloadRolesEventRef.unsubscribe();
});
</script>
