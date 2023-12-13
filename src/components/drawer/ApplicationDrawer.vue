<template>
  <q-drawer
    show-if-above
    :width="200"
    :breakpoint="500"
    bordered
  >
    <q-scroll-area class="fit">
      <q-list>
        <template
          v-for="(menuItem, index) in menuList"
          :key="index"
        >
          <q-item
            v-ripple
            clickable
            :active="$route.path.startsWith(menuItem.url)"
            :data-cy="`drawer_item_${menuItem.name}`"
            @click="$router.push(menuItem.url)"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const menuList = ref([
  {
    icon: t('ApplicationDrawer.icon.users'),
    label: t('ApplicationDrawer.text.users'),
    url: '/users',
    name: 'users',
  },
  {
    icon: t('ApplicationDrawer.icon.userGroups'),
    label: t('ApplicationDrawer.text.userGroups'),
    url: '/user-groups',
    name: 'userGroups',
  },
  {
    icon: t('ApplicationDrawer.icon.roles'),
    label: t('ApplicationDrawer.text.roles'),
    url: '/roles',
    name: 'roles',
  },
  {
    icon: t('ApplicationDrawer.icon.libraries'),
    label: t('ApplicationDrawer.text.libraries'),
    url: '/libraries',
    name: 'libraries',
  },
]);
</script>

<style lang="scss" scoped>
.q-item--active {
  border-right: solid $primary 5px;
  background: $secondary;
  color: white;
}
</style>
