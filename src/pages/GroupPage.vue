<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_group_go_back"
          :label="$t('GroupPage.text.goBack')"
          :icon="$t('GroupPage.icon.goBack')"
          @click="$router.push('/groups')"
        />
      </q-card-section>
      <q-card-section class="q-py-none">
        <h4
          class="q-ma-none q-mb-sm"
          data-cy="page_group_title"
        >
          {{ group.name }}
        </h4>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tabs
          :model-value="currentTab"
          no-caps
          active-color="primary"
          align="left"
          @update:model-value="updateUrl"
        >
          <q-tab
            name="users"
            :label="$t('GroupPage.text.usersTab')"
            data-cy="page_group_users_tab"
          />
          <q-tab
            name="groups"
            :label="$t('GroupPage.text.groupsTab')"
            data-cy="page_group_groups_tab"
          />
          <q-tab
            name="roles"
            :label="$t('GroupPage.text.rolesTab')"
            data-cy="page_group_roles_tab"
          />
          <q-tab
            name="permissions"
            :label="$t('GroupPage.text.permissionsTab')"
            data-cy="page_group_permissions_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_group_loading"
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
      <users-tab-panel
        name="users"
        type="group"
        :entity="group"
        @update:users-query="(v) => setTabsQuery('users', v)"
      />
      <access-control-tab-panel
        name="groups"
        type="group"
        sub-type="group"
        :entity="group"
        @update:access-control-query="(v) => setTabsQuery('groups', v)"
      />
      <access-control-tab-panel
        name="roles"
        type="role"
        sub-type="group"
        :entity="group"
        @update:access-control-query="(v) => setTabsQuery('roles', v)"
      />
      <permissions-tab-panel
        name="permissions"
        type="group"
        :entity="group"
        @update:permissions-query="(v) => setTabsQuery('permissions', v)"
      />
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import UsersTabPanel from 'components/tab-panel/UsersTabPanel.vue';
import AccessControlTabPanel from 'components/tab-panel/AccessControlTabPanel.vue';
import PermissionsTabPanel from 'components/tab-panel/PermissionsTabPanel.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const group = ref({});
const tabsQuery = ref({
  users: {},
  groups: {},
  roles: {},
  permissions: {},
});
const currentTab = computed(() => route.query.tab || 'users');

/**
 * Update url with current tab query params.
 * @param {string} tab - Tab Name.
 */
function updateUrl(tab) {
  const query = { tab, ...tabsQuery.value[tab] };
  const queryString = new URLSearchParams(query).toString();

  router.push(`/groups/${group.value.id}?${queryString}`);
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
 * Load group from id in url. If the group does not exist, redirect to the libraries page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadGroup() {
  loading.value = true;

  return GroupService.findById(route.params.id)
    .then((data) => {
      group.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('GroupPage.text.notFound'),
        html: true,
      });
      router.push('/groups');
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(async () => {
  await loadGroup();
});
</script>
