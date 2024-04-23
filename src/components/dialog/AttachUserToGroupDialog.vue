<template>
  <q-dialog v-model="show">
    <q-card class="attach-user-to-group-form">
      <q-card-section class="flex row justify-center">
        <span class="text-h6">
          {{ $t('AttachUserToGroupDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row items-center">
          <q-icon
            left
            color="info"
            :name="$t('AttachUserToGroupDialog.icon.info')"
          />
          <span>
            {{ $t('AttachUserToGroupDialog.text.content') }}
          </span>
        </q-card-section>
        <q-card-section>
          <users-table
            v-model:selected="selected"
            v-model:filter-name="userName"
            v-model:filter-login="userLogin"
            v-model:filter-email="userEmail"
            v-model:current-page="currentPage"
            v-model:max-page="maxPage"
            v-model:elements-per-page="elementsPerPage"
            v-model:total-elements="totalElements"
            :users="users"
            :show-action="false"
            :detach-action="false"
            :remove-action="false"
            :no-data-label="$t('UsersTable.text.noData')"
            :no-data-icon="$t('UsersTable.icon.noData')"
            selection="multiple"
            class="full-width"
            @on-filter="search"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            v-close-popup
            :label="$t('AttachUserToGroupDialog.text.cancel')"
            color="negative"
          />
          <q-btn
            :label="$t('AttachUserToGroupDialog.text.confirm')"
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
import UsersTable from 'src/components/tables/UsersTable.vue';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import SelectEvent from 'src/composables/events/SelectEvent';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const { t } = useI18n();
const submitting = ref(false);
const groupId = ref('');
const selected = ref([]);
const users = ref([]);
const selectOnly = ref(false);
const userName = ref('');
const userLogin = ref('');
const userEmail = ref('');
const currentPage = ref(0);
const maxPage = ref(0);
const elementsPerPage = ref(10);
const totalElements = ref(0);

/**
 * Create API filters from component ref.
 * @returns {object} Object that contains user filters.
 */
function getFilters() {
  const filters = {};

  if (userName.value?.length > 0) {
    filters.name = `lk_*${userName.value}*`;
  }

  if (userLogin.value?.length > 0) {
    filters.login = `lk_*${userLogin.value}*`;
  }

  if (userEmail.value?.length > 0) {
    filters.email = `lk_*${userEmail.value}*`;
  }

  if (currentPage.value >= 1) {
    filters.page = `${currentPage.value - 1}`;
  }

  if (elementsPerPage.value !== 10) {
    filters.count = `${elementsPerPage.value}`;
  }

  return filters;
}

/**
 * Get users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  return UserService.find(getFilters()).then((data) => {
    users.value = data.content;
    currentPage.value = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    elementsPerPage.value = data.size;
    totalElements.value = data.totalElements;
  });
}

const { show } = useDialog('attach-user-to-group', (event) => {
  submitting.value = false;
  groupId.value = event.groupId;
  selected.value = [];
  selectOnly.value = event.selectOnly || false;
  return search();
});

/**
 * Attach one or more users to a group.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  if (selectOnly.value) {
    SelectEvent.SelectUsersEvent.next(selected.value);
    show.value = false;

    return;
  }

  submitting.value = true;

  const userLoginList = selected.value.map(({ login }) => login);

  await Promise.allSettled(userLoginList
    .map((login) => GroupService.associateGroupAndUser(login, groupId.value)
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('AttachUserToGroupDialog.text.notifyError'),
          html: true,
        });

        throw new Error(login);
      })))
    .then((results) => {
      const failedRequestObjects = [];

      results.forEach(({ status, reason }) => {
        if (status === 'rejected' && reason.message) {
          failedRequestObjects.push(...selected.value
            .filter(({ login }) => login === reason.message));
        }
      });

      selected.value = failedRequestObjects;

      if (results.every(({ status }) => status === 'fulfilled')) {
        Notify.create({
          type: 'positive',
          message: t('AttachUserToGroupDialog.text.notifySuccess'),
          html: true,
        });

        show.value = false;
      }
    }).finally(async () => {
      ReloadUsersEvent.next();
      submitting.value = false;

      if (userLoginList.includes(userStore.login)) {
        userStore.permissions = await UserService.getMyPermissions();
      }
    });
}
</script>

<style scoped>
.attach-user-to-group-form {
  min-width: 50vw;
}
</style>
