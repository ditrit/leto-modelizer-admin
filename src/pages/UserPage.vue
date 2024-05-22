<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-item class="q-my-none">
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
      </q-item>
      <q-item>
        <q-item-section
          v-if="user.login"
          avatar
        >
          <user-avatar
            :login="user.login"
            size="100px"
            square
          />
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-h4"
            data-cy="page_user_title"
          >
            {{ user.name }}
          </q-item-label>
          <q-item-label
            v-if="user.email"
            class="text-h5"
            caption
          >
            {{ user.email }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section class="q-pa-none">
        <q-tabs
          :model-value="currentTab"
          no-caps
          active-color="primary"
          align="left"
          @update:model-value="updateUrl"
        >
          <q-tab
            name="groups"
            :label="$t('UserPage.text.groupsTab')"
            data-cy="page_user_groups_tab"
          />
          <q-tab
            name="roles"
            :label="$t('UserPage.text.rolesTab')"
            data-cy="page_user_roles_tab"
          />
          <q-tab
            name="permissions"
            :label="$t('UserPage.text.permissionsTab')"
            data-cy="page_user_permissions_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_user_loading"
      />
    </q-card>
    <q-tab-panels
      :model-value="currentTab"
      animated
      transition-prev="jump-up"
      transition-next="jump-down"
      class="bg-grey-1"
      @update:model-value="updateUrl"
    >
      <access-control-tab-panel
        name="groups"
        type="group"
        sub-type="user"
        :entity="user"
        @update:access-control-query="(v) => setTabsQuery('groups', v)"
      />
      <access-control-tab-panel
        name="roles"
        type="role"
        sub-type="user"
        :entity="user"
        @update:access-control-query="(v) => setTabsQuery('roles', v)"
      />
      <permissions-tab-panel
        name="permissions"
        type="user"
        :entity="user"
        @update:permissions-query="(v) => setTabsQuery('permissions', v)"
      />
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import {
  onMounted,
  ref,
  computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import UserAvatar from 'components/avatar/UserAvatar.vue';
import AccessControlTabPanel from 'components/tab-panel/AccessControlTabPanel.vue';
import PermissionsTabPanel from 'components/tab-panel/PermissionsTabPanel.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const user = ref({});
const tabsQuery = ref({
  groups: {},
  roles: {},
  permissions: {},
});
const currentTab = computed(() => route.query.tab || 'groups');

/**
 * Update url with current tab query params.
 * @param {string} tab - Tab Name.
 */
function updateUrl(tab) {
  const query = { tab, ...tabsQuery.value[tab] };
  const queryString = new URLSearchParams(query).toString();

  router.push(`/users/${user.value.login}?${queryString}`);
}

/**
 * Set tabsQuery and call updateUrl.
 * @param {string} tab - Tab name.
 * @param {object} query - Query params object emitted from corresponding tab.
 */
function setTabsQuery(tab, query) {
  tabsQuery.value[tab] = query;
  updateUrl(tab);
}

/**
 * Load user from login in url. If the user does not exist, redirect to the users page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUser() {
  loading.value = true;

  return UserService.findByLogin(route.params.login)
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
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(async () => {
  await loadUser();
});
</script>
