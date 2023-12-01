Feature: Test roundtrip of the application

  Scenario: Check application is up
    When I visit the '/'
    Then I expect '[data-cy="application-name"]' exists
    And  I expect '[data-cy="application-name"]' is 'Leto Modelizer Admin'
    And  I expect '[data-cy="page_users_title"]' is 'Users'
