<template>
  <q-tooltip
    class="q-pa-none shadow-1"
    persistent
  >
    <q-card class="q-ma-none">
      <q-item>
        <q-item-section
          v-if="user.login"
          avatar
        >
          <user-avatar
            :login="user.login"
            color="white"
            size="100px"
            square
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h4 text-black">
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
    </q-card>
  </q-tooltip>
</template>

<script setup>
import UserAvatar from 'components/avatar/UserAvatar.vue';

defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
