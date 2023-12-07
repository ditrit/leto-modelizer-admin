import { Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.intercept(
    {
      method: 'GET',
      url: '/backend/api/users/me',
    },
    {
      objectId: 'id',
      username: 'Username',
      firstname: 'Firstname',
    },
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/api/roles*',
    },
    [{ name: 'admin' }],
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/backend/api/classes/Library*',
    },
    { results: [{ name: 'admin' }] },
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/backend/api/classes/_Role*',
    },
    { results: [{ name: 'CF_createProject' }] },
  );
});
