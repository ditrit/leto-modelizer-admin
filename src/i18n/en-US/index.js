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
      roleList: 'List of users attributed to {group}',
      attachUser: 'Attach user',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attachUser: 'fa-solid fa-link',
    },
  },
  UserPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'User not found.',
      roleList: 'List of roles attributed to {user}',
      groupList: 'Group of {user}',
      attach: 'Attach group',
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
    },
  },
  GroupsTable: {
    text: {
      nameColumn: 'Name',
      actionsColumn: 'Actions',
    },
  },
  UsersTable: {
    text: {
      nameColumn: 'Name',
      userNameColumn: 'UserName',
      emailColumn: 'Email',
      actionsColumn: 'Actions',
    },
  },
  RolesTable: {
    text: {
      nameColumn: 'Name',
      typeColumn: 'Type',
      roleTypeLibrary: 'Library',
      roleTypeSystem: 'System',
      roleTypeFunctional: 'Functional',
    },
    color: {
      roleTypeLibrary: 'blue',
      roleTypeSystem: 'orange',
      roleTypeFunctional: 'teal',
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
      warning: 'You will delete yourself. If you confirm, you will be redirected to leto modelizer.',
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
  DetachGroupDialog: {
    text: {
      title: 'Do you want to remove the group "{group}" from the user "{user}" ?',
      content: 'You can always reassign the group to the user.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Group is removed from user.',
    },
  },
  AttachGroupToUserDialog: {
    text: {
      title: 'Attach one or more groups to user',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a group to the user.',
      notifySuccess: 'Group(s) successfully attached to the user.',
    },
  },
  AttachUserToGroupDialog: {
    text: {
      title: 'Attach one or more users to group',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a user to the group.',
      notifySuccess: 'User(s) successfully attached to the group.',
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
