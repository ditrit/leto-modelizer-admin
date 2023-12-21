export default {
  ApplicationDrawer: {
    text: {
      users: 'Users',
      userGroups: 'User Groups',
      libraries: 'Libraries',
      roles: 'Roles',
    },
    icon: {
      users: 'fa-solid fa-user',
      userGroups: 'fa-solid fa-users',
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
  UserGroupsPage: {
    text: {
      title: 'User Groups',
    },
  },
  UserGroupPage: {
    text: {
      goBack: 'Return to previous page',
      notFound: 'User Group not found.',
    },
    icon: {
      goBack: 'fa-solid fa-chevron-left',
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
    },
  },
  LibraryPage: {
    text: {
      author: 'Author:',
      description: 'Description:',
      version: 'Version:',
      goBack: 'Return to previous page',
      notFound: 'Library not found.',
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
  UserGroupsTable: {
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
    },
  },
  RolesTable: {
    text: {
      nameColumn: 'Role Name',
      typeColumn: 'Role Type',
      typeColumnLibrary: 'Library',
      typeColumnSystem: 'System',
      typeColumnFunctional: 'Functional',
    },
  },
  RemoveLibraryDialog: {
    text: {
      title: 'Do you want to delete the library {name} ?',
      content: 'Please note, this action is irrerversible.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notifySuccess: 'Library is removed.',
    },
  },
};
