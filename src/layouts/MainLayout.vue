<template>
  <q-layout view="hHh lpR fFf">
    <application-header />
    <application-drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
    <application-footer />
    <remove-library-dialog />
    <remove-user-dialog />
  </q-layout>
</template>
<script setup>
import ApplicationHeader from 'components/header/ApplicationHeader.vue';
import ApplicationFooter from 'components/footer/ApplicationFooter.vue';
import ApplicationDrawer from 'components/drawer/ApplicationDrawer.vue';
import RemoveLibraryDialog from 'components/dialog/RemoveLibraryDialog.vue';
import RemoveUserDialog from 'components/dialog/RemoveUserDialog.vue';
</script>
