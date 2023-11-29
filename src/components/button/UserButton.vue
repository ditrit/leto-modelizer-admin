<template>
  <q-btn-dropdown
    rounded
    auto-close
    color="white"
    text-color="primary"
    class="q-pa-xs"
    data-cy="user-button"
  >
    <template #label>
      <q-avatar
        color="primary"
        text-color="white"
        size="md"
        font-size="12px"
        :title="`${firstname} ${username}`"
      >
        {{ userInitials }}
      </q-avatar>
    </template>
    <q-list>
      <q-item
        clickable
        class="settings-item"
        data-cy="item_goLeto"
        @click="goLeto"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-right-from-bracket"
          />
        </q-item-section>
        <q-item-section no-wrap>
          {{ $t('page.settings.goLeto') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from 'src/stores/UserStore';

const userStore = useUserStore();
const firstname = computed(() => userStore.firstname);
const username = computed(() => userStore.username);
const userInitials = computed(
  () => `${userStore.firstname?.at(0) || ''}${userStore.username?.at(0) || ''}`.toUpperCase(),
);

/**
 * Go back to leto-modelizer.
 */
function goLeto() {
  window.location.href = process.env.LETO_MODELIZER_URL;
}
</script>

<style lang="scss" scoped>
.settings-item {
  user-select: none;
}
</style>
