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
      rolesTab: 'Roles',
      usersTab: 'Users',
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
      rolesTab: 'Roles',
      groupsTab: 'Groups',
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
  RolePage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'Role not found.',
      usersTab: 'Users',
      groupsTab: 'Groups',
      rolesTab: 'Sub roles',
      permissionsTab: 'Permissions',
      userList: 'List of users attributed to {role}',
      groupList: 'Group of {role}',
      roleList: 'Sub role of {role}',
      permissionList: 'Permissions of {role}',
      attachUser: 'Attach user',
      attachGroup: 'Attach group',
      attachPermission: 'Attach permission',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attach: 'fa-solid fa-link',
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
      templatesTab: 'Templates',
      templateTabTitle: 'List of templates',
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
      noData: 'No libraries found.',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      noData: 'fa-solid fa-face-frown-open',
    },
  },
  GroupsTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
      showAction: 'Show group',
      removeAction: 'Remove group',
      detachAction: 'Detach group',
      noData: 'No groups found.',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
      noData: 'fa-solid fa-face-frown-open',
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
      noData: 'No users found.',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
      noData: 'fa-solid fa-face-frown-open',
    },
  },
  RolesTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
      showAction: 'Show role',
      removeAction: 'Remove role',
      detachAction: 'Detach role',
      noData: 'No roles found.',
    },
    icon: {
      showAction: 'fa-solid fa-pen-to-square',
      removeAction: 'fa-solid fa-trash',
      detachAction: 'fa-solid fa-link-slash',
      noData: 'fa-solid fa-face-frown-open',
    },
  },
  PermissionsTable: {
    text: {
      keyColumn: 'Description',
      entityColumn: 'Entity',
      actionColumn: 'Operation',
      actionsColumn: 'Actions',
      detachAction: 'Detach permission',
      noData: 'No Permissions found.',
    },
    icon: {
      detachAction: 'fa-solid fa-link-slash',
      noData: 'fa-solid fa-face-frown-open',
    },
  },
  TemplatesTable: {
    text: {
      iconColumn: 'Icon',
      nameColumn: 'Name',
      typeColumn: 'Type',
      descriptionColumn: 'Description',
      pluginsColumn: 'Plugins',
      documentationUrlColumn: 'Link to documentation',
      actionsColumn: 'Actions',
      noData: 'No templates found.',
    },
    icon: {
      noData: 'fa-solid fa-face-frown-open',
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
  RemoveRoleDialog: {
    text: {
      title: 'Do you want to delete the role {name} ?',
      content: 'Please note, this action is irreversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is removed.',
      notifyError: 'Error during role deletion.',
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
  DetachGroupFromRoleDialog: {
    text: {
      title: 'Do you want to detach the group "{group}" from the role "{role}" ?',
      content: 'You can always reassign the group to the role.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is detached from role.',
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
  DetachUserFromRoleDialog: {
    text: {
      title: 'Do you want to detach the user "{user}" from the role "{role}" ?',
      content: 'You can always reassign the user to the role.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'User is detached from role.',
      warning: 'Losing your role means losing permission, and if you no longer have admin access, you will be redirected to Leto-Modelizer.',
    },
    icon: {
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  DetachPermissionFromRoleDialog: {
    text: {
      title: 'Do you want to detach the permission "{permission}" from the role "{role}" ?',
      content: 'You can always reassign the permission to the role.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Permission is detached from role.',
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
  AttachUserToRoleDialog: {
    text: {
      title: 'Attach one or more users to role',
      content: 'By associating a role to a user, it will inherit all the role\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a user to the role.',
      notifySuccess: 'User(s) successfully attached to the role.',
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
  AttachGroupToRoleDialog: {
    text: {
      title: 'Attach one or more groups to role',
      content: 'By associating a role to a group, it will inherit all the role\'s permissions.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a group to the role.',
      notifySuccess: 'Group(s) successfully attached to the role.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AttachPermissionToRoleDialog: {
    text: {
      title: 'Attach one or more permissions to role',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a permission to the role.',
      notifySuccess: 'Permission(s) successfully attached to the role.',
    },
    icon: {
      info: 'fa-solid fa-circle-info',
    },
  },
  AttachGroupToGroupDialog: {
    text: {
      title: 'Attach one or more groups to group',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a group to the group.',
      notifySuccess: 'Group(s) successfully attached to the group.',
    },
  },
  AddLibraryPage: {
    text: {
      title: 'Add library',
      url: 'Url of library',
      role: 'Name of library role',
      notEmpty: 'Field is required.',
      validRoleName: 'Must start and end with a capital letter/number, use uppercase letters, numbers, _, or -.',
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
  TablePaginationCard: {
    text: {
      content: '{current}/{max} of {total}',
      menuTitle: 'Roles per page:',
    },
    icon: {
      first: 'fa-solid fa-backward-step',
      last: 'fa-solid fa-forward-step',
      previous: 'fa-solid fa-chevron-left',
      next: 'fa-solid fa-chevron-right',
      menu: 'fa-solid fa-ellipsis-vertical',
    },
  },
  Permissions: {
    text: {
      ADMIN_ACCESS_NULL: 'Permission to access and use leto-modelizer-admin',
      COMPONENT_CREATE_NULL: 'Permission to create a component',
      COMPONENT_TEMPLATE_CREATE_NULL: 'Permission to create a component from template',
      DIAGRAM_CREATE_NULL: 'Permission to create a diagram',
      DIAGRAM_DELETE_NULL: 'Permission to delete a diagram',
      DIAGRAM_TEMPLATE_CREATE_NULL: 'Permission to create a diagram from template',
      LIBRARY_ACCESS_ID: 'Permission to access a specific library defined by its id',
      LIBRARY_ACCESS_NULL: 'Permission to access all libraries',
      LIBRARY_CREATE_NULL: 'Permission to create a library',
      LIBRARY_DELETE_NULL: 'Permission to delete a library',
      LIBRARY_DELETE_ID: 'Permission to delete a specific library defined by its id',
      LIBRARY_UPDATE_ID: 'Permission to update a specific library defined by its id',
      LIBRARY_UPDATE_NULL: 'Permission to update a library',
      PROJECT_CREATE_NULL: 'Permission to create a project',
      PROJECT_TEMPLATE_CREATE_NULL: 'Permission to create a project from template',
      libraryInfo: 'More information about library',
      ADMIN: 'Administration application',
      PROJECT: 'Project',
      COMPONENT: 'Component',
      DIAGRAM: 'Diagram',
      PROJECT_TEMPLATE: 'Project template',
      COMPONENT_TEMPLATE: 'Component template',
      DIAGRAM_TEMPLATE: 'Diagram template',
      LIBRARY: 'Library',
      DELETE: 'Delete',
      CREATE: 'Create',
      UPDATE: 'Update',
      ACCESS: 'Access',
    },
  },
  TemplateTypes: {
    text: {
      PROJECT: 'Project',
      COMPONENT: 'Component',
      DIAGRAM: 'Diagram',
    },
  },
};
