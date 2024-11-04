<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-py-none q-pt-md">
        <h4
          class="q-mx-none q-mt-md q-mb-sm"
          data-cy="page_ai-settings_title"
        >
          {{ $t('AISettingsPage.text.title') }}
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
            name="configurations"
            :label="$t('AISettingsPage.text.configurationsTab')"
            data-cy="page_ai-settings_configurations_tab"
          />
          <q-tab
            name="secrets"
            :label="$t('AISettingsPage.text.secretsTab')"
            data-cy="page_ai-settings_secrets_tab"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_ai-settings_loading"
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
      <configurations-tab-panel
        name="configurations"
        @update:configurations-query="(v) => setTabsQuery('configurations', v)"
      />
      <secrets-tab-panel
        name="secrets"
        @update:secrets-query="(v) => setTabsQuery('secrets', v)"
      />
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConfigurationsTabPanel from 'components/tab-panel/ConfigurationsTabPanel.vue';
import SecretsTabPanel from 'components/tab-panel/SecretsTabPanel.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const tabsQuery = ref({
  configurations: {},
  secrets: {},
});
const currentTab = computed(() => route.query.tab || 'configurations');

/**
 * Update url with current tab query params.
 * @param {string} tab - Tab Name.
 */
function updateUrl(tab) {
  const query = { tab, ...tabsQuery.value[tab] };
  const queryString = new URLSearchParams(query).toString();

  router.push(`/ai?${queryString}`);
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
</script>
