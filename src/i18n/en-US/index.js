export default {
  ApplicationDrawer: {
    text: {
      users: 'Users',
      groups: 'User Groups',
      libraries: 'Libraries',
      roles: 'Roles',
    },
    icon: {
      users: 'fa-solid fa-user',
      groups: 'fa-solid fa-users',
      libraries: 'fa-solid fa-book-open',
      roles: 'fa-solid fa-screwdriver-wrench',
    },
  },
  ApplicationFooter: {
    text: {
      version: 'Version {version}',
    },
  },
  ApplicationHeader: {
    text: {
      applicationName: 'Leto Modelizer Admin',
      title: 'Administration area',
    },
  },
  ErrorNotFoundPage: {
    text: {
      title: '404',
      content: 'Oops. Nothing here...',
      goToHome: 'Back to homepage',
    },
  },
  IndexPage: {
    text: {
      title: 'Users',
    },
  },
  GroupsPage: {
    text: {
      title: 'User Groups',
    },
  },
  GroupPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'Group not found.',
      userList: 'List of users attributed to {group}',
      roleList: 'Role of {group}',
      attachUser: 'Attach user',
      attachRole: 'Attach role',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attachUser: 'fa-solid fa-link',
      attachRole: 'fa-solid fa-link',
    },
  },
  UserPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'User not found.',
      roleList: 'List of roles attributed to {user}',
      groupList: 'Group of {user}',
      attachGroup: 'Attach group',
      attachRole: 'Attach role',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attach: 'fa-solid fa-link',
    },
  },
  RolesPage: {
    text: {
      title: 'Roles',
    },
  },
  LibrariesPage: {
    text: {
      title: 'Libraries',
      add: 'Add',
    },
    icon: {
      add: 'fa-solid fa-plus',
    },
  },
  LibraryPage: {
    text: {
      maintainer: 'Maintainer:',
      description: 'Description:',
      version: 'Version:',
      goBack: 'Return to previous page',
      notFound: 'Library not found.',
      informationTab: 'Information',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
    },
  },
  UserButton: {
    text: {
      goLeto: 'Go to leto-modelizer',
    },
    icon: {
      goLeto: 'fa-solid fa-right-from-bracket',
    },
  },
  LibrariesTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
      showAction: 'Show library',
      removeAction: 'Remove library',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
    },
  },
  GroupsTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
      showAction: 'Show group',
      removeAction: 'Remove group',
      detachAction: 'Detach group',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
    },
  },
  UsersTable: {
    text: {
      nameColumn: 'Name',
      loginColumn: 'Login',
      emailColumn: 'Email',
      actionsColumn: 'Actions',
      showAction: 'Show user',
      removeAction: 'Remove user',
      detachAction: 'Detach user',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
    },
  },
  RolesTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
      showAction: 'Show role',
      removeAction: 'Remove role',
      detachAction: 'Detach role',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
    },
  },
  RemoveLibraryDialog: {
    text: {
      title: 'Do you want to delete the library {name} ?',
      content: 'Please note, this action is irreversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Library is removed.',
    },
  },
  RemoveUserDialog: {
    text: {
      title: 'Do you want to delete the user {name} ?',
      content: 'Please note, this action is irreversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'User is removed.',
      warning: 'You will delete yourself and any associated groups, permissions, and roles. If you confirm, you will be automatically disconnected.',
    },
    icon: {
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  RemoveGroupDialog: {
    text: {
      title: 'Do you want to delete the group "{name}" ?',
      content: 'Please note, this action is irreversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is removed.',
    },
  },
  DetachGroupFromUserDialog: {
    text: {
      title: 'Do you want to detach the group "{group}" from the user "{user}" ?',
      content: 'You can always reassign the group to the user.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is detached from user.',
    },
  },
  DetachUserFromGroupDialog: {
    text: {
      title: 'Do you want to detach the user "{user}" from the group "{group}" ?',
      content: 'You can always reassign the user to the group.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'User is detached from group.',
    },
  },
  DetachRoleFromGroupDialog: {
    text: {
      title: 'Do you want to detach the role "{role}" from the group "{group}" ?',
      content: 'You can always reassign the role to the group.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is detached from group.',
    },
  },
  DetachRoleFromUserDialog: {
    text: {
      title: 'Do you want to detach the role "{role}" from the user "{user}" ?',
      content: 'You can always reassign the role to the user.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is detached from user.',
      warning: 'Losing your role means losing permission, and if you no longer have admin access, you will be redirected to Leto-Modelizer.',
    },
    icon: {
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  RedirectDialog: {
    text: {
      title: 'Redirect to Leto-Modelizer',
      content: 'You don\'t have permission to access this application. Please contact an administrator to access this application.',
      redirect: 'Go to Leto-Modelizer',
    },
  },
  AttachGroupToUserDialog: {
    text: {
      title: 'Attach one or more groups to user',
      content: 'By associating a group to a user, it will inherit all the group\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a group to the user.',
      notifySuccess: 'Group(s) successfully attached to the user.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AttachUserToGroupDialog: {
    text: {
      title: 'Attach one or more users to group',
      content: 'By associating a user to a group, it will inherit all the group\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a user to the group.',
      notifySuccess: 'User(s) successfully attached to the group.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AttachRoleToUserDialog: {
    text: {
      title: 'Attach one or more roles to user',
      content: 'By associating a role to a user, it will inherit all the role\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a role to the user.',
      notifySuccess: 'Role(s) successfully attached to the user.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AttachRoleToGroupDialog: {
    text: {
      title: 'Attach one or more roles to group',
      content: 'By associating a role to a group, it will inherit all the role\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a role to the group.',
      notifySuccess: 'Role(s) successfully attached to the group.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AddLibraryPage: {
    text: {
      title: 'Add library',
      url: 'Url of library',
      role: 'Name of library role',
      notEmpty: 'Field is required.',
      notifyError: 'Error during library creation.',
      notifySuccess: 'Library is created.',
      urlAlreadyExists: 'Library with this url already exists.',
      urlNotFound: 'Library with this url can not be downloaded.',
      roleAlreadyExists: 'Library with this role already exists.',
    },
  },
  InformationLibraryTabPanel: {
    text: {
      notEmpty: 'Field is required.',
      synchronizeTitle: 'Library URL',
      synchronize: 'Synchronize',
      synchronizeSuccess: 'Library is synchronized.',
      synchronizeError: 'Error during library synchronization.',
      urlAlreadyExists: 'Library with this url already exists.',
      urlNotFound: 'Library with this url can not be downloaded.',
    },
    icon: {
      synchronize: 'fa-solid fa-rotate',
    },
  },
};
