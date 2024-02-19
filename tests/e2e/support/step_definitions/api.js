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

  cy.intercept('GET', '/api/groups/1', {
    statusCode: 200,
    body: group1,
  });

  cy.intercept('GET', '/api/groups/2', {
    statusCode: 200,
    body: group2,
  });

  cy.intercept('GET', '/api/groups/unknown', {
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

  cy.intercept('POST', '/api/groups/2/users', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('DELETE', '/api/groups/1', (request) => {
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
    },
  });

  cy.intercept('POST', '/api/roles/2/users', (request) => {
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
    } else if (role === 'alreadyExist') {
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
}

Before(() => {
  setUserIntercepts();
  setGroupIntercepts();
  setRoleIntercepts();
  setLibraryIntercepts();

  cy.intercept('https://localhost:8443/api/logout', 'ok');
});
