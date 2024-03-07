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
      <user-avatar
        v-if="login"
        :login="login"
      />
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
            :name="$t('UserButton.icon.goLeto')"
          />
        </q-item-section>
        <q-item-section no-wrap>
          {{ $t('UserButton.text.goLeto') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from 'src/stores/UserStore';
import UserAvatar from 'src/components/avatar/UserAvatar.vue';

const userStore = useUserStore();
const login = computed(() => userStore.login);

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
