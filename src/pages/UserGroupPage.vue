<template>
  <q-page class="column bg-grey-1">
    <q-card class="no-border-radius">
      <q-card-section class="q-my-none">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          data-cy="page_userGroup_go_back"
          :label="$t('UserGroupPage.text.goBack')"
          :icon="$t('UserGroupPage.icon.goBack')"
          @click="$router.push('/user-groups')"
        />
      </q-card-section>
      <q-card-section class=" q-py-none">
        <h4
          class="q-ma-none"
          data-cy="page_userGroup_title"
        >
          {{ userGroup.name }}
        </h4>
      </q-card-section>
      <q-linear-progress
        v-if="loading"
        indeterminate
        color="primary"
        data-cy="page_userGroup_loading"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as UserGroupService from 'src/services/UserGroupService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userGroup = ref({});

/**
 * Load userGroup from id in url. If the userGroup does not exist, redirect to the libraries page.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUserGroup() {
  loading.value = true;

  return UserGroupService.findById(route.params.id)
    .then((data) => {
      userGroup.value = data;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('UserGroupPage.text.notFound'),
        html: true,
      });
      router.push('/user-groups');
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  loadUserGroup();
});
</script>
