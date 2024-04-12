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
    <remove-role-dialog />
    <detach-group-from-user-dialog />
    <detach-user-from-group-dialog />
    <detach-role-from-user-dialog />
    <detach-user-from-role-dialog />
    <detach-access-control-from-another-dialog />
    <detach-permission-from-role-dialog />
    <attach-group-to-user-dialog />
    <attach-user-to-group-dialog />
    <attach-role-to-user-dialog />
    <attach-user-to-role-dialog />
    <attach-access-control-to-another-dialog />
    <attach-permission-to-role-dialog />
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
import RemoveRoleDialog from 'components/dialog/RemoveRoleDialog.vue';
import DetachGroupFromUserDialog from 'components/dialog/DetachGroupFromUserDialog.vue';
import DetachUserFromGroupDialog from 'components/dialog/DetachUserFromGroupDialog.vue';
import DetachRoleFromUserDialog from 'components/dialog/DetachRoleFromUserDialog.vue';
import DetachUserFromRoleDialog from 'components/dialog/DetachUserFromRoleDialog.vue';
import DetachAccessControlFromAnotherDialog from 'components/dialog/DetachAccessControlFromAnotherDialog.vue';
import DetachPermissionFromRoleDialog from 'components/dialog/DetachPermissionFromRoleDialog.vue';
import AttachGroupToUserDialog from 'components/dialog/AttachGroupToUserDialog.vue';
import AttachUserToGroupDialog from 'components/dialog/AttachUserToGroupDialog.vue';
import AttachRoleToUserDialog from 'components/dialog/AttachRoleToUserDialog.vue';
import AttachUserToRoleDialog from 'components/dialog/AttachUserToRoleDialog.vue';
import AttachAccessControlToAnotherDialog from 'components/dialog/AttachAccessControlToAnotherDialog.vue';
import AttachPermissionToRoleDialog from 'components/dialog/AttachPermissionToRoleDialog.vue';
import RedirectDialog from 'components/dialog/RedirectDialog.vue';
</script>
