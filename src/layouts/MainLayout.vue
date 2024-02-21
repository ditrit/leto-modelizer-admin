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
    <remove-group-dialog />
    <detach-group-from-user-dialog />
    <detach-user-from-group-dialog />
    <detach-role-from-user-dialog />
    <detach-role-from-group-dialog />
    <attach-group-to-user-dialog />
    <attach-user-to-group-dialog />
    <attach-role-to-user-dialog />
    <attach-role-to-group-dialog />
    <redirect-dialog />
  </q-layout>
</template>
<script setup>
import ApplicationHeader from 'components/header/ApplicationHeader.vue';
import ApplicationFooter from 'components/footer/ApplicationFooter.vue';
import ApplicationDrawer from 'components/drawer/ApplicationDrawer.vue';
import RemoveLibraryDialog from 'components/dialog/RemoveLibraryDialog.vue';
import RemoveUserDialog from 'components/dialog/RemoveUserDialog.vue';
import RemoveGroupDialog from 'components/dialog/RemoveGroupDialog.vue';
import DetachGroupFromUserDialog from 'components/dialog/DetachGroupFromUserDialog.vue';
import DetachUserFromGroupDialog from 'components/dialog/DetachUserFromGroupDialog.vue';
import DetachRoleFromUserDialog from 'components/dialog/DetachRoleFromUserDialog.vue';
import DetachRoleFromGroupDialog from 'components/dialog/DetachRoleFromGroupDialog.vue';
import AttachGroupToUserDialog from 'components/dialog/AttachGroupToUserDialog.vue';
import AttachUserToGroupDialog from 'components/dialog/AttachUserToGroupDialog.vue';
import AttachRoleToUserDialog from 'components/dialog/AttachRoleToUserDialog.vue';
import AttachRoleToGroupDialog from 'components/dialog/AttachRoleToGroupDialog.vue';
import RedirectDialog from 'components/dialog/RedirectDialog.vue';
</script>
