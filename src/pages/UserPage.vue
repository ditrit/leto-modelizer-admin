<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_user_go_back"
          :label="$t('UserPage.text.goBack')"
          :icon="$t('UserPage.icon.goBack')"
          @click="$router.push('/users')"
        />
      </q-card-section>
      <q-card-section class=" q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_user_title"
        >
          {{ user.firstname }}
        </h4>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_user_loading"
      />
    </q-card>
    <q-card-section>
      <h6
        class="q-ma-none q-mb-sm"
        data-cy="page_user_subtitle"
      >
        {{ $t('UserPage.text.groupList', { user: user.firstname }) }}
      </h6>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white q-mb-md"
        data-cy="page_user_button_attach_group"
        :label="$t('UserPage.text.attach')"
        :icon="$t('UserPage.icon.attach')"
        @click="openAttachGroupToUserDialog"
      />
      <user-groups-table
        :user-groups="userGroups"
        :show-action="false"
        :remove-action="false"
      />
    </q-card-section>
  </q-page>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import * as UserGroupService from 'src/services/UserGroupService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadUserAttachedGroupsEvent from 'src/composables/events/ReloadUserAttachedGroupsEvent';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = ref({});
const userGroups = ref([]);

let reloadUserAttachedGroupsEventRef;

/**
 * Load user from id in url. If the user does not exist, redirect to the users page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUser() {
  return UserService.findById(route.params.id)
    .then((data) => {
      user.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('UserPage.text.notFound'),
        html: true,
      });
      router.push('/users');
    });
}

/**
 * Get user groups using user Id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroups() {
  return UserGroupService.findByUserId(route.params.id).then((data) => {
    userGroups.value = data;
  });
}

/**
 * Search user and associated groups.
 */
async function search() {
  loading.value = true;

  Promise.allSettled([loadUser(), loadGroups()])
    .finally(() => {
      loading.value = false;
    });
}

/**
 * Open dialog to attach a group to user.
 */
function openAttachGroupToUserDialog() {
  DialogEvent.next({
    key: 'attach-group-to-user',
    type: 'open',
    userId: route.params.id,
  });
}

onMounted(async () => {
  reloadUserAttachedGroupsEventRef = ReloadUserAttachedGroupsEvent.subscribe(loadGroups);
  await search();
});

onUnmounted(() => {
  reloadUserAttachedGroupsEventRef.unsubscribe();
});
</script>
