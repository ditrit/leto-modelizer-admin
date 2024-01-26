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
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
    },
  },
  UserPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'User not found.',
      roleList: 'List of role attributed to {user}',
      groupList: 'Group of {user}',
      attach: 'Attach group',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
      attach: 'fa-solid fa-plus',
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
      author: 'Author:',
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
      nameColumn: 'Role Name',
      typeColumn: 'Role Type',
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
  AttachGroupToUserDialog: {
    text: {
      title: 'Attach one or more groups to user',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifyError: 'Error during attachment of a group to the user.',
      notifySuccess: 'Group(s) successfully attached to the user.',
    },
  },
  AddLibraryPage: {
    text: {
      title: 'Add library',
      url: 'Url of library',
      roleName: 'Name of library role',
      notEmpty: 'Field is required.',
      notifyError: 'Error during library creation.',
      notifySuccess: 'Library is created.',
      urlAlreadyExists: 'Library with this url already exists.',
      urlNotFound: 'Library with this url can not be downloaded.',
      roleNameAlreadyExists: 'Library with this roleName already exists.',
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
