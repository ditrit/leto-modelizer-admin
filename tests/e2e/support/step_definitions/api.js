import { Before } from '@badeball/cypress-cucumber-preprocessor';

const adminUser = {
  name: 'Admin',
  login: 'admin',
  email: 'admin@admin.com',
};
const user = {
  name: 'Name',
  login: 'login',
  email: 'test@test.com',
};
const group1 = {
  id: '1',
  name: 'Group 1',
};
const group2 = {
  id: '2',
  name: 'Group 2',
};
const group3 = {
  id: '3',
  name: 'GROUP',
};
const superAdmin = {
  id: 1,
  name: 'Super administrator',
};
const admin = {
  id: 2,
  name: 'Administrator',
};
const dev = {
  id: 3,
  name: 'Developer',
};
const library1 = {
  id: '1',
  name: 'lib1',
  version: '1.0.0',
  maintainer: 'Maintainer_1',
  description: 'description_1',
  url: 'url_1',
};
const library2 = {
  id: '2',
  name: 'lib2',
  version: '2.0.0',
  maintainer: 'Maintainer_2',
  description: 'description_2',
};
const permission1 = {
  id: '1',
  entity: 'PROJECT',
  action: 'CREATE',
  key: 'description_2',
};
const permission2 = {
  id: '2',
  entity: 'DIAGRAM',
  action: 'CREATE',
  key: 'description_2',
};
const templates = {
  content: [{
    id: 1,
    name: 'templateName',
    type: 'PROJECT',
    description: 'templateDescription',
    plugins: ['plugin1', 'plugin2'],
    schemas: [],
    files: [],
  }],
};

/**
 * User-specific intercepts
 */
function setUserIntercepts() {
  cy.intercept('GET', '/api/users/me', {
    statusCode: 200,
    body: adminUser,
  });

  cy.intercept('GET', '/api/users/me/permissions', {
    statusCode: 200,
    body: [{
      entity: 'ADMIN',
      action: 'ACCESS',
    }],
  });

  cy.intercept('GET', /\/api\/users\/[A-Za-z0-9_]+\/picture/, {
    statusCode: 200,
    body: 'picture',
  });

  cy.intercept('GET', '/api/users', {
    statusCode: 200,
    body: {
      content: [adminUser, user],
    },
  });

  cy.intercept('GET', '/api/users/Maintainer_1', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/users/Maintainer_2', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/users/admin', {
    statusCode: 200,
    body: adminUser,
  });

  cy.intercept('GET', '/api/users/login', {
    statusCode: 200,
    body: user,
  });

  cy.intercept('GET', '/api/users/unknown', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/users/unknown/roles', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/users/unknown/groups', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/users/admin/roles', {
    statusCode: 200,
    body: {
      content: [superAdmin],
    },
  });

  cy.intercept('GET', '/api/users/login/roles', {
    statusCode: 200,
    body: {
      content: [dev],
    },
  });

  cy.intercept('GET', '/api/users/login/groups', {
    statusCode: 200,
    body: {
      content: [group2],
    },
  });

  cy.intercept('GET', '/api/users/admin/groups', {
    statusCode: 200,
    body: {
      content: [group1],
    },
  });

  cy.intercept('DELETE', '/api/users/admin', (request) => {
    request.reply({ statusCode: 204 });
  });

  cy.intercept('DELETE', '/api/users/login', (request) => {
    request.reply({ statusCode: 204 });
  });
}

/**
 * Group-specific intercepts
 */
function setGroupIntercepts() {
  cy.intercept('GET', '/api/groups', {
    statusCode: 200,
    body: {
      content: [group1, group2],
    },
  });

  cy.intercept('GET', '/api/groups?id=not_2', {
    statusCode: 200,
    body: {
      content: [group1],
    },
  });

  cy.intercept('GET', '/api/groups/1', {
    statusCode: 200,
    body: group1,
  });

  cy.intercept('GET', '/api/groups/2', {
    statusCode: 200,
    body: group2,
  });

  cy.intercept('GET', '/api/groups/3', {
    statusCode: 200,
    body: group3,
  });

  cy.intercept('GET', '/api/groups/unknown', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/groups/unknown/roles', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/groups/unknown/users', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/groups/unknown/groups', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/groups/unknown/permissions', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/groups/1/users', {
    statusCode: 200,
    body: {
      content: [adminUser],
    },
  });

  cy.intercept('GET', '/api/groups/2/users', {
    statusCode: 200,
    body: {
      content: [adminUser],
    },
  });

  cy.intercept('GET', '/api/groups/1/groups', {
    statusCode: 200,
    body: {
      content: [group1],
    },
  });

  cy.intercept('GET', '/api/groups/2/groups', {
    statusCode: 200,
    body: {
      content: [group1],
    },
  });

  cy.intercept('GET', '/api/groups/3/groups', {
    statusCode: 200,
    body: {
      content: [group1],
    },
  });

  cy.intercept('GET', '/api/groups/3/users', {
    statusCode: 200,
    body: {
      content: [adminUser],
    },

  });

  cy.intercept('GET', '/api/groups/1/roles', {
    statusCode: 200,
    body: {
      content: [superAdmin],
    },
  });

  cy.intercept('GET', '/api/groups/2/roles', {
    statusCode: 200,
    body: {
      content: [dev],
    },
  });

  cy.intercept('GET', '/api/groups/1/permissions', {
    statusCode: 200,
    body: {
      content: [{
        entity: 'ADMIN',
        action: 'ACCESS',
      }],
    },
  });

  cy.intercept('GET', '/api/groups/2/permissions', {
    statusCode: 200,
    body: {
      content: [{
        entity: 'ADMIN',
        action: 'ACCESS',
      }],
    },
  });

  cy.intercept('GET', '/api/groups/3/permissions', {
    statusCode: 200,
    body: {
      content: [{
        entity: 'ADMIN',
        action: 'ACCESS',
      }],
    },
  });

  cy.intercept('GET', '/api/groups/3/roles', {
    statusCode: 200,
    body: {
      content: [dev],
    },
  });

  cy.intercept('POST', '/api/groups', {
    statusCode: 200,
    body: { id: '3' },
  });

  cy.intercept('POST', '/api/groups/3/users', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/groups/2/users', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/groups/1/groups', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/groups/2/groups', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/groups/1', (request) => {
    request.reply({ statusCode: 204 });
  });

  cy.intercept('DELETE', '/api/groups/1/groups/2', (request) => {
    request.reply({ statusCode: 204 });
  });

  cy.intercept('DELETE', '/api/groups/1/users/admin', (request) => {
    request.reply({ statusCode: 204 });
  });

  cy.intercept('DELETE', '/api/groups/2/users/admin', (request) => {
    request.reply({ statusCode: 204 });
  });
}

/**
 * Role-specific intercepts
 */
function setRoleIntercepts() {
  cy.intercept('GET', '/api/roles', {
    statusCode: 200,
    body: {
      content: [
        superAdmin,
        admin,
        dev,
      ],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 10,
      totalElements: 3,
    },
  });

  cy.intercept('GET', '/api/roles?name=not_SUPER_ADMINISTRATOR&id=not_1', {
    statusCode: 200,
    body: {
      content: [admin],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 10,
      totalElements: 3,
    },
  });

  cy.intercept('GET', '/api/roles?page=0', {
    statusCode: 200,
    body: {
      content: [
        superAdmin,
        admin,
        dev,
      ],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 10,
      totalElements: 3,
    },
  });

  cy.intercept('GET', '/api/roles?name=lk_*test*&page=0', {
    statusCode: 200,
    body: {
      content: [
        superAdmin,
        admin,
        dev,
      ],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 10,
      totalElements: 3,
    },
  });

  cy.intercept('GET', '/api/roles?name=not_SUPER_ADMINISTRATOR', {
    statusCode: 200,
    body: {
      content: [
        admin,
        dev,
      ],
    },
    pageable: {
      pageNumber: 0,
    },
    totalPages: 1,
    size: 10,
    totalElements: 3,
  });

  cy.intercept('GET', '/api/roles/unknown', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/roles/unknown/users', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/roles/unknown/groups', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/roles/unknown/roles', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/roles/unknown/permissions', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/api/roles/1', {
    statusCode: 200,
    body: superAdmin,
  });

  cy.intercept('GET', '/api/roles/1/users', {
    statusCode: 200,
    body: {
      content: [
        adminUser,
      ],
    },
  });

  cy.intercept('GET', '/api/roles/1/groups', {
    statusCode: 200,
    body: {
      content: [
        group1,
      ],
    },
  });

  cy.intercept('GET', '/api/roles/1/roles', {
    statusCode: 200,
    body: {
      content: [
        dev,
      ],
    },
  });

  cy.intercept('GET', '/api/roles/1/permissions', {
    statusCode: 200,
    body: {
      content: [
        permission1,
      ],
    },
  });

  cy.intercept('POST', '/api/roles/1/users', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/2/roles', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/1/permissions', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/2/users', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/1/groups', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/2/groups', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('POST', '/api/roles/3/groups', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/3/groups/2', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/3/roles/1', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/1', (request) => {
    request.reply({
      statusCode: 400,
    });
  });

  cy.intercept('DELETE', '/api/roles/2', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/1/groups/1', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/1/permissions/1', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/1/users/admin', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/roles/3/users/login', (request) => {
    request.reply({
      statusCode: 200,
    });
  });
}

/**
 * Library-specific intercepts
 */
function setLibraryIntercepts() {
  cy.intercept('GET', '/api/libraries', (request) => {
    request.reply({
      statusCode: 200,
      body: {
        content: [library1, library2],
      },
    });
  });

  cy.intercept('GET', '/api/libraries/1', {
    statusCode: 200,
    body: library1,
  });

  cy.intercept('GET', '/api/libraries/2', {
    statusCode: 200,
    body: library2,
  });

  cy.intercept('DELETE', '/api/libraries/2', (request) => {
    request.reply({ statusCode: 204 });
  });

  cy.intercept('GET', '/api/libraries/3', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('POST', '/api/libraries', (request) => {
    const { url, role } = request.body;

    if (url === 'alreadyExist') {
      request.reply({
        statusCode: 400,
        body: {
          message: 'Library with this url already exists',
        },
      });
    } else if (url === 'notFound') {
      request.reply({
        statusCode: 400,
        body: {
          message: 'Other error',
        },
      });
    } else if (role === 'ROLE-1') {
      request.reply({
        statusCode: 400,
        body: {
          message: 'Library with this role already exists',
        },
      });
    } else {
      request.reply({
        statusCode: 200,
        body: {
          id: '1',
        },
      });
    }
  });

  cy.intercept('PUT', '/api/libraries/1', (request) => {
    const { url } = request.body;

    if (url === 'notFound') {
      request.reply({
        statusCode: 400,
        body: {
          message: 'Other error',
        },
      });
    } else if (url === 'alreadyExist') {
      request.reply({
        statusCode: 400,
        body: {
          message: 'Library with this url already exists',
        },
      });
    } else {
      request.reply({
        statusCode: 200,
        body: {
          id: '1',
        },
      });
    }
  });

  cy.intercept('GET', '/api/libraries/1/templates', {
    statusCode: 200,
    body: templates,
  });
}

Before(() => {
  setUserIntercepts();
  setGroupIntercepts();
  setRoleIntercepts();
  setLibraryIntercepts();

  cy.intercept('GET', '/api/permissions', {
    statusCode: 200,
    body: {
      content: [
        permission1,
        permission2,
      ],
    },
  });

  cy.intercept('GET', '/api/csrf', (request) => {
    request.reply({ statusCode: 200 });
  });

  cy.intercept('https://localhost:8443/api/logout', 'ok');
});
