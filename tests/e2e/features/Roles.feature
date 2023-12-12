Feature: Test roundtrip of the application: Roles

  ################## List roles ##################
  ## 101 Should display all roles

  Scenario: Roundtrip about Roles
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_roles"]'
    Then  I expect current url is '/roles'

    ## 101 Should display all roles
    And I expect '[data-cy="roles_table"] tbody tr' appear 4 times on screen
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'CF_createProject'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-type' is 'System'

    And I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'admin'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-type' is 'System'

    And I expect '[data-cy="roles_table"] tbody tr:nth-child(3) td.role-name' is 'lib_test'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(3) td.role-type' is 'Library'

    And I expect '[data-cy="roles_table"] tbody tr:nth-child(4) td.role-name' is 'other'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(4) td.role-type' is 'Functional'
