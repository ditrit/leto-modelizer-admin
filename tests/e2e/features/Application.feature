Feature: Test roundtrip of the application

  Scenario: Check application is up
    When I visit the '/'
    Then I expect '[data-cy="application-name"]' exists
    And  I expect '[data-cy="application-name"]' is 'Leto Modelizer Admin'
    And  I expect '[data-cy="page_users_title"]' is 'Users'
    And  I expect current url is '/users'

    # Navigate to UserGroupsPage
    When I click on '[data-cy="drawer_item_userGroups"]'
    Then I expect '[data-cy="page_userGroups_title"]' is 'User Groups'
    And  I expect current url is '/user-groups'

    # Navigate to RolesPage
    When I click on '[data-cy="drawer_item_roles"]'
    Then I expect '[data-cy="page_roles_title"]' is 'Roles'
    And  I expect current url is '/roles'

    # Navigate to LibrariesPage
    When I click on '[data-cy="drawer_item_libraries"]'
    Then I expect '[data-cy="page_libraries_title"]' is 'Libraries'
    And  I expect current url is '/libraries'
