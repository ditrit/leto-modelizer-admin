<template>
  <q-tab-panel
    name="secrets"
    data-cy="secrets_tab_panel"
  >
    <div class="row justify-between items-center">
      <h6
        class="q-ma-none q-mb-sm"
        data-cy="secrets_title"
      >
        {{ $t('SecretsTabPanel.text.title') }}
      </h6>
      <q-btn
        outline
        no-caps
        color="primary"
        class="bg-white"
        data-cy="secrets_button_add"
        :label="$t('SecretsTabPanel.text.add')"
        :icon="$t('SecretsTabPanel.icon.add')"
        @click="openAddSecretDialog"
      />
    </div>
    <secrets-table
      v-model:filter-key="filters.key"
      v-model:current-page="filters.page"
      v-model:max-page="maxPage"
      v-model:elements-per-page="filters.count"
      v-model:total-elements="totalElements"
      :secrets="secrets"
      :no-data-label="$t('SecretsTable.text.noData')"
      :no-data-icon="$t('SecretsTable.icon.noData')"
      @edit="openUpdateSecretDialog"
      @remove="openRemoveSecretDialog"
      @on-filter="search"
    />
  </q-tab-panel>
</template>

<script setup>
import SecretsTable from 'components/tables/SecretsTable.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';
import secretFilters from 'src/composables/filters/SecretFilters';
import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import * as SecretService from 'src/services/SecretService';

const emits = defineEmits([
  'update:secrets-query',
]);

const route = useRoute();
const secrets = ref([]);
const maxPage = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const {
  filters,
  init,
  getFilters,
  generateQuery,
} = useServerSideFilter(secretFilters);

let reloadSecretsEventRef;

/**
 * Open dialog to add a new secret.
 */
function openAddSecretDialog() {
  DialogEvent.next({
    key: 'add-secret',
    type: 'open',
  });
}

/**
 * Open dialog to update secret.
 * @param {object} secret - Secret object to edit for the dialog.
 */
function openUpdateSecretDialog(secret) {
  DialogEvent.next({
    key: 'update-secret',
    type: 'open',
    secret,
  });
}

/**
 * Open dialog to remove secret.
 * @param {object} secret - Secret object to remove for the dialog.
 */
function openRemoveSecretDialog(secret) {
  DialogEvent.next({
    key: 'remove-secret',
    type: 'open',
    secret,
  });
}

/**
 * Search and display users.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function search() {
  loading.value = true;

  return SecretService.find(getFilters()).then((data) => {
    secrets.value = data.content;
    filters.value.page = data.pageable.pageNumber + 1;
    maxPage.value = data.totalPages;
    filters.value.count = data.size;
    totalElements.value = data.totalElements;

    return Promise.resolve();
  }).finally(() => {
    loading.value = false;
    emits('update:secrets-query', generateQuery());
  });
}

onMounted(async () => {
  init(route.query);
  reloadSecretsEventRef = ReloadSecretsEvent.subscribe(search);
  await search();
});

onUnmounted(() => {
  reloadSecretsEventRef.unsubscribe();
});
</script>
