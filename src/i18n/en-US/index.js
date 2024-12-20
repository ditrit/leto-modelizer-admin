export default {
  ApplicationDrawer: {
    text: {
      users: 'Users',
      groups: 'User Groups',
      libraries: 'Libraries',
      roles: 'Roles',
      ai: 'AI settings',
    },
    icon: {
      users: 'fa-solid fa-user',
      groups: 'fa-solid fa-users',
      libraries: 'fa-solid fa-book-open',
      roles: 'fa-solid fa-screwdriver-wrench',
      ai: 'fa-solid fa-toolbox',
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
  AISettingsPage: {
    text: {
      title: 'AI settings',
      configurationsTab: 'Configuration',
      secretsTab: 'Secrets',
    },
  },
  GroupsPage: {
    text: {
      title: 'User Groups',
      add: 'Add',
    },
    icon: {
      add: 'fa-solid fa-plus',
    },
  },
  GroupPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'Group not found.',
      permissionList: 'List of permissions attributed to {group}',
      usersTab: 'Users',
      groupsTab: 'Groups',
      rolesTab: 'Roles',
      permissionsTab: 'Permissions',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attach: 'fa-solid fa-link',
    },
  },
  UserPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'User not found.',
      rolesTab: 'Roles',
      groupsTab: 'Groups',
      permissionsTab: 'Permissions',
      permissionList: 'List of permissions attributed to {user}',
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
      rolesTab: 'Roles',
      permissionsTab: 'Permissions',
      permissionList: 'List of permissions attributed to {role}',
      attachPermission: 'Attach permission',
      addGroupMessage: 'Attaching groups to the Super Administrator role is restricted.',
      addRoleMessage: 'Attaching roles to the Super Administrator role is restricted.',
      addPermissionMessage: 'Attaching permissions to the Super Administrator role is restricted.',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attach: 'fa-solid fa-link',
      warning: 'fa-solid fa-triangle-exclamation',
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
      avatarColumn: 'Avatar',
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
  SecretsTable: {
    text: {
      keyColumn: 'Key',
      actionsColumn: 'Actions',
      editAction: 'Edit secret',
      updateDateColumn: 'Last update date',
      removeAction: 'Remove secret',
      noData: 'No secrets found.',
    },
    icon: {
      editAction: 'fa-solid fa-pen',
      removeAction: 'fa-solid fa-trash',
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
  AddSecretDialog: {
    text: {
      title: 'Add a new secret.',
      cancel: 'Cancel',
      confirm: 'Add',
      notifySuccess: 'Secret is added.',
      notifyError: 'Error during secret creation.',
      key: 'Secret key',
      value: 'Secret value',
    },
    icon: {
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  UpdateSecretDialog: {
    text: {
      title: 'Update secret {key}.',
      cancel: 'Cancel',
      confirm: 'Update',
      notifySuccess: 'Secret is updated.',
      notifyError: 'Error during secret update.',
      value: 'New secret value',
    },
  },
  RemoveSecretDialog: {
    text: {
      title: 'Do you want to delete the secret {key} ?',
      content: 'Please note, this action is irreversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Secret is deleted.',
      notifyError: 'Error during secret deletion.',
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
      notifyError: 'Error during group detachment from user.',
    },
  },
  DetachUserFromGroupDialog: {
    text: {
      title: 'Do you want to detach the user "{user}" from the group "{group}" ?',
      content: 'You can always reassign the user to the group.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'User is detached from group.',
      notifyError: 'Error during user detachment from group.',
    },
  },
  DetachRoleFromGroupDialog: {
    text: {
      title: 'Do you want to detach the role "{accessControlToDetach}" from the group "{accessControl}" ?',
      content: 'You can always reassign the role to the group.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is detached from group.',
    },
  },
  DetachRoleFromRoleDialog: {
    text: {
      title: 'Do you want to detach the role "{accessControlToDetach}" from the role "{accessControl}" ?',
      content: 'You can always reassign the role to the role.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is detached from role.',
    },
  },
  DetachGroupFromRoleDialog: {
    text: {
      title: 'Do you want to detach the group "{accessControlToDetach}" from the role "{accessControl}" ?',
      content: 'You can always reassign the group to the role.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is detached from role.',
    },
  },
  DetachGroupFromGroupDialog: {
    text: {
      title: 'Do you want to detach the group "{accessControlToDetach}" from the group "{accessControl}" ?',
      content: 'You can always reassign the group to the group.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is detached from group.',
    },
  },
  DetachRoleFromUserDialog: {
    text: {
      title: 'Do you want to detach the role "{role}" from the user "{user}" ?',
      content: 'You can always reassign the role to the user.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Role is detached from user.',
      notifyError: 'Error during role detachment from user.',
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
      notifyError: 'Error during user detachment from role.',
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
  AttachRoleToRoleDialog: {
    text: {
      title: 'Attach one or more roles to role',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a role to the role.',
      notifySuccess: 'Role(s) successfully attached to the role.',
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
      add: 'Add',
      cancel: 'Cancel',
      url: 'Url of library',
      role: 'Name of library role',
      notEmpty: 'Field is required.',
      validName: 'Must start and end with a capital letter/number, use uppercase letters, numbers, _, or -.',
      notifyError: 'Error during library creation.',
      notifySuccess: 'Library is created.',
      urlAlreadyExists: 'Library with this url already exists.',
      urlNotFound: 'Library with this url can not be downloaded.',
      roleAlreadyExists: 'Library with this role already exists.',
    },
  },
  AddGroupPage: {
    text: {
      title: 'Create a user group',
      add: 'Add',
      cancel: 'Cancel',
      subtitle: 'You must attach at least one user and one role to the new group.',
      name: 'Group name',
      users: 'Group member(s)',
      roles: 'Group role(s)',
      notEmpty: 'Field is required.',
      validName: 'Must start and end with a capital letter/number, use uppercase letters, numbers, _, or -.',
      notifyError: 'Error during group creation.',
      notifySuccess: 'Group is created.',
      groupAlreadyExists: 'Group with this name already exists.',
      attachUser: 'Add a member',
      attachRole: 'Add a role',
      addUsertoGroupMessage: 'Please add at least one member to create a group',
      addRoletoGroupMessage: 'Please add at least one role to create a group',
    },
    icon: {
      attach: 'fa-solid fa-link',
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
  RolesTabPanel: {
    text: {
      title: 'List of roles attributed to {name}',
      attach: 'Attach role',
    },
    icon: {
      attach: 'fa-solid fa-link',
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  ConfigurationsTabPanel: {
    text: {
      title: 'AI Configuration',
    },
  },
  SecretsTabPanel: {
    text: {
      title: 'AI Secrets',
      add: 'Add new secret',
    },
    icon: {
      add: 'fa-solid fa-plus',
    },
  },
  UsersTabPanel: {
    text: {
      title: 'List of users attributed to {name}',
      attach: 'Attach user',
    },
    icon: {
      attach: 'fa-solid fa-link',
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  GroupsTabPanel: {
    text: {
      title: 'List of groups attributed to {name}',
      attach: 'Attach group',
    },
    icon: {
      attach: 'fa-solid fa-link',
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  PermissionsTabPanel: {
    text: {
      title: 'List of permissions attributed to {name}',
      attach: 'Attach permission',
    },
    icon: {
      attach: 'fa-solid fa-link',
      warning: 'fa-solid fa-triangle-exclamation',
    },
  },
  DefaultAIConfigurationCard: {
    text: {
      title: 'Global configuration',
      addPlugin: 'Add AI model for a new plugin',
      editPlugin: 'Update AI model for existing plugin',
      newPluginNameLabel: 'Plugin name',
      newPluginNameHint: '"default" for all unlisted plugin',
      newPluginHandler: 'Select AI model for plugin',
      save: 'Save',
      update: 'Update',
      notEmpty: 'Field is required.',
      notifyDeleteSuccess: 'Configuration is deleted.',
      notifySaveSuccess: 'Configuration is added.',
      notifyUpdateSuccess: 'Configuration(s) is updated.',
    },
    icon: {
      delete: 'fa-solid fa-trash',
    },
  },
  CustomAIConfigurationCard: {
    text: {
      title: 'AI configuration: {handler}',
      pluginTitle: 'Plugin configuration: { plugin }',
      save: 'Save',
      notEmpty: 'Field is required.',
      notifySaveSuccess: 'Configuration is saved.',
    },
    icon: {
      delete: 'fa-solid fa-trash',
    },
  },
  TablePaginationCard: {
    text: {
      content: '{current}/{max} of {total}',
      menuTitle: 'Row per page:',
    },
    icon: {
      first: 'fa-solid fa-backward-step',
      last: 'fa-solid fa-forward-step',
      previous: 'fa-solid fa-chevron-left',
      next: 'fa-solid fa-chevron-right',
      menu: 'fa-solid fa-ellipsis-vertical',
    },
  },
  RoleFiltersCard: {
    text: {
      title: 'Filters',
      byName: 'by name',
    },
    icon: {
      byName: 'fa-solid fa-magnifying-glass',
    },
  },
  SecretFiltersCard: {
    text: {
      title: 'Filters',
      byKey: 'by key',
    },
    icon: {
      byKey: 'fa-solid fa-magnifying-glass',
    },
  },
  UserFiltersCard: {
    text: {
      filters: 'Filters',
      name: 'by name',
      login: 'by login',
      email: 'by email',
    },
    icon: {
      name: 'fa-solid fa-magnifying-glass',
      login: 'fa-solid fa-magnifying-glass',
      email: 'fa-solid fa-magnifying-glass',
    },
  },
  PermissionFiltersCard: {
    text: {
      filters: 'Filters',
      entity: 'by entity',
      action: 'by operation',
      libraryId: 'by library',
      noResults: 'No results',
    },
    icon: {
      entity: 'fa-solid fa-magnifying-glass',
      action: 'fa-solid fa-magnifying-glass',
      libraryId: 'fa-solid fa-magnifying-glass',
    },
  },
  GroupFiltersCard: {
    text: {
      title: 'Filters',
      byName: 'by name',
    },
    icon: {
      byName: 'fa-solid fa-magnifying-glass',
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
      PROJECT_GIT_CREATE_NULL: 'Permission to import a project from git',
      PROJECT_TEMPLATE_CREATE_NULL: 'Permission to create a project from template',
      libraryInfo: 'More information about library',
      ADMIN: 'Administration application',
      PROJECT: 'Project',
      PROJECT_GIT: 'Project from git',
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
