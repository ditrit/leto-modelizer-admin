Feature: Test roundtrip of the application: UserGroups

  ################## List UserGroups ##################
  ## 101 Should display all userGroups

  Scenario: Roundtrip about UserGroups
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_userGroups"]'
    Then  I expect current url is '/user-groups'

    ## 101 Should display all userGroups
    And I expect '[data-cy="userGroups_table"] tbody tr' appear 1 time on screen
    And I expect '[data-cy="userGroups_table"] tbody tr td' is 'group'
