import { Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  let isUserDeleted = false;
  let isCurrentUserDeleted = false;
  let isLibraryDeleted = false;
  let isGroupDeleted = false;
  const user1 = {
    objectId: 'id_1',
    username: 'Username',
    firstname: 'Firstname',
    email: 'test@test.com',
  };
  const currentUser = {
    objectId: 'id_2',
    username: 'Current User',
    firstname: 'Admin',
    email: 'admin@admin.com',
  };
  const library1 = {
    objectId: 'id_1',
    name: 'lib1',
    version: '1.0.0',
    author: 'Author_1',
    description: 'description_1',
    url: 'url_1',
  };
  const library2 = {
    objectId: 'id_2',
    name: 'lib2',
    version: '2.0.0',
    author: 'Author_2',
    description: 'description_2',
  };
  const group1 = {
    objectId: 'id_1',
    name: 'group1',
  };

  cy.intercept('GET', '/backend/api/users/me', {
    statusCode: 200,
    body: {
      objectId: 'id_2',
      username: 'User',
      firstname: 'First',
    },
  });

  cy.intercept('GET', '/backend/api/Users', (request) => {
    let results = [user1, currentUser];

    if (isUserDeleted) {
      results = [currentUser];

      if (isCurrentUserDeleted) {
        results = [];
      }
    }

    request.reply({
      statusCode: 200,
      body: {
        results,
      },
    });
  });

  cy.intercept('GET', '/backend/api/Users/id_1', {
    statusCode: 200,
    body: user1,
  });

  cy.intercept('GET', '/backend/api/Users/id_3', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('DELETE', '/backend/api/Users/id_1', (request) => {
    isUserDeleted = true;
    request.reply({ statusCode: 204 });
  });

  cy.intercept('DELETE', '/backend/api/Users/id_2', (request) => {
    isCurrentUserDeleted = true;
    request.reply({ statusCode: 204 });
  });

  cy.intercept('GET', '/backend/api/roles*', {
    statusCode: 200,
    body: {
      results: [{ name: 'admin' }],
    },
  });

  cy.intercept('GET', '/backend/api/classes/_Role', {
    statusCode: 200,
    body: {
      results: [
        { name: 'CF_createProject' },
        { name: 'admin' },
        { name: 'lib_test' },
        { name: 'other' },
      ],
    },
  });

  cy.intercept('GET', '/backend/api/classes/Library', (request) => {
    request.reply({
      statusCode: 200,
      body: {
        results: isLibraryDeleted ? [library1] : [library1, library2],
      },
    });
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_1', {
    statusCode: 200,
    body: library1,
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_2', {
    statusCode: 200,
    body: library2,
  });

  cy.intercept('DELETE', '/backend/api/classes/Library/id_2', (request) => {
    isLibraryDeleted = true;
    request.reply({ statusCode: 204 });
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_3', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('POST', '/backend/api/classes/Library', (request) => {
    const { url, roleName } = request.body;

    if (url === 'alreadyExist') {
      request.reply({
        statusCode: 400,
        body: {
          error: 'Library with this url already exists',
        },
      });
    } else if (url === 'notFound') {
      request.reply({
        statusCode: 400,
        body: {
          error: 'Other error',
        },
      });
    } else if (roleName === 'alreadyExist') {
      request.reply({
        statusCode: 400,
        body: {
          error: 'Library with this roleName already exists',
        },
      });
    } else {
      request.reply({
        statusCode: 200,
        body: {
          objectId: 'id_1',
        },
      });
    }
  });

  cy.intercept('PUT', '/backend/api/classes/Library/id_1', (request) => {
    const { url } = request.body;

    if (url === 'notFound') {
      request.reply({
        statusCode: 400,
        body: {
          error: 'Other error',
        },
      });
    } else if (url === 'alreadyExist') {
      request.reply({
        statusCode: 400,
        body: {
          error: 'Library with this url already exists',
        },
      });
    } else {
      request.reply({
        statusCode: 200,
        body: {
          objectId: 'id_1',
        },
      });
    }
  });

  cy.intercept('GET', '/backend/api/classes/Group', (request) => {
    request.reply({
      statusCode: 200,
      body: {
        results: isGroupDeleted ? [] : [group1],
      },
    });
  });

  cy.intercept('GET', '/backend/api/classes/Group/id_1', {
    statusCode: 200,
    body: group1,
  });

  cy.intercept('DELETE', '/backend/api/classes/Group/id_1', (request) => {
    isGroupDeleted = true;
    request.reply({ statusCode: 204 });
  });

  cy.intercept('GET', '/backend/api/classes/Group/id_3', {
    statusCode: 404,
    body: 'Not Found',
  });

  cy.intercept('GET', '/backend/api/classes/Group?*', (request) => {
    request.reply({
      statusCode: 200,
      body: {
        results: [group1],
      },
    });
  });

  cy.intercept('PUT', '/backend/api/classes/Group/id_1', (request) => {
    request.reply({
      statusCode: 200,
    });
  });

  cy.intercept('http://localhost:8080/token/clear', 'ok');
});
