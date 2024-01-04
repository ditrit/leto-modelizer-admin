<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_library_go_back"
          :label="$t('LibraryPage.text.goBack')"
          :icon="$t('LibraryPage.icon.goBack')"
          @click="$router.push('/libraries')"
        />
      </q-card-section>
      <q-card-section class=" q-py-none">
        <h4
          class="q-ma-none"
          data-cy="page_library_title"
        >
          {{ library.name }}
        </h4>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="q-mr-md">
            <span class="q-mr-sm text-bold">{{ $t('LibraryPage.text.version') }}</span>
            <span data-cy="page_library_version">{{ library.version }}</span>
          </div>
          <div>
            <span class="q-mr-sm text-bold">{{ $t('LibraryPage.text.author') }}</span>
            <span data-cy="page_library_author">{{ library.author }}</span>
          </div>
        </div>
        <div>
          <span class="q-mr-sm text-bold">{{ $t('LibraryPage.text.description') }}</span>
          <span data-cy="page_library_description">{{ library.description }}</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="currentTab"
          no-caps
          active-color="primary"
          align="left"
        >
          <q-tab
            name="information"
            :label="$t('LibraryPage.text.informationTab')"
          />
        </q-tabs>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_library_loading"
      />
    </q-card>
    <q-tab-panels
      v-model="currentTab"
      animated
      class="bg-grey-1"
    >
      <information-library-tab-panel
        name="information"
        :library="library"
        @synchronize="loadLibrary"
      />
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as LibraryService from 'src/services/LibraryService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import InformationLibraryTabPanel from 'components/tab-panel/InformationLibraryTabPanel.vue';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const library = ref({});
const currentTab = ref('information');

/**
 * Load library from id in url. If the library does not exist, redirect to the libraries page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadLibrary() {
  loading.value = true;

  return LibraryService.findById(route.params.id)
    .then((data) => {
      library.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('LibraryPage.text.notFound'),
        html: true,
      });
      router.push('/libraries');
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  loadLibrary();
});
</script>
