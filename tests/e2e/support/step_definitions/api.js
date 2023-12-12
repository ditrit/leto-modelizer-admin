import { Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  const library1 = {
    objectId: 'id_1',
    name: 'lib1',
    version: '1.0.0',
    author: 'Author_1',
    description: 'description_1',
  };
  const library2 = {
    objectId: 'id_2',
    name: 'lib2',
    version: '2.0.0',
    author: 'Author_2',
    description: 'description_2',
  };

  cy.intercept('GET', '/backend/api/users/me', {
    statusCode: 200,
    body: {
      objectId: 'id',
      username: 'Username',
      firstname: 'Firstname',
    },
  });

  cy.intercept('GET', '/backend/api/roles*', {
    statusCode: 200,
    body: {
      results: [{ name: 'admin' }],
    },
  });

  cy.intercept('GET', '/backend/api/classes/_Role*', {
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

  cy.intercept('GET', '/backend/api/classes/Library?*', {
    statusCode: 200,
    body: {
      results: [library1, library2],
    },
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_1', {
    statusCode: 200,
    body: library1,
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_2', {
    statusCode: 200,
    body: library2,
  });

  cy.intercept('GET', '/backend/api/classes/Library/id_3', {
    statusCode: 404,
    body: 'Not Found',
  });
});
