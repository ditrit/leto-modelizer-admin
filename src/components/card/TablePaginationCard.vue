<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <q-btn
        flat
        round
        size="sm"
        color="primary"
        :icon="$t('TablePaginationCard.icon.first')"
        :disable="current === 1"
        @click="$emit('update:current', 1)"
      />
      <q-btn
        flat
        round
        size="sm"
        color="primary"
        :icon="$t('TablePaginationCard.icon.previous')"
        :disable="current === 1"
        @click="$emit('update:current', current - 1)"
      />
      <span class="text-grey-8 text-weight-bold q-mx-sm">
        {{ $t('TablePaginationCard.text.content', { current, max, total }) }}
      </span>
      <q-btn
        flat
        round
        size="sm"
        color="primary"
        :icon="$t('TablePaginationCard.icon.next')"
        :disable="current >= max"
        @click="$emit('update:current', current + 1)"
      />
      <q-btn
        flat
        round
        size="sm"
        color="primary"
        :icon="$t('TablePaginationCard.icon.last')"
        :disable="current >= max"
        @click="$emit('update:current', max)"
      />
      <q-btn
        flat
        round
        size="sm"
        color="primary"
        class="q-ml-md"
        :icon="$t('TablePaginationCard.icon.menu')"
      >
        <q-menu>
          <q-list>
            <q-item-label header>
              {{ $t('TablePaginationCard.text.menuTitle') }}
            </q-item-label>
            <q-item
              v-for="pageSize in pageSizes"
              :key="`size-${pageSize}`"
              v-close-popup
              :active="pageSize === size"
              active-class="text-white text-weight-bold bg-secondary"
              clickable
              @click="$emit('update:size', pageSize)"
            >
              <q-item-section>
                {{ pageSize }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
  current: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 10,
  },
});
defineEmits(['update:current', 'update:size']);
const pageSizes = ref([1, 2, 3, 4, 5, 10, 15, 20, 25, 50]);
</script>
