Feature: Test roundtrip of the application: Users

  ################## List Users ##################
  ## 101 Should display all users

  Scenario: Roundtrip about Users
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_users"]'
    Then  I expect current url is '/users'

    ## 101 Should display all users
    And I expect '[data-cy="users_table"] tbody tr' appear 1 time on screen
    And I expect '[data-cy="users_table"] tbody tr td.user-firstname' is 'Firstname'
    And I expect '[data-cy="users_table"] tbody tr td.user-username' is 'Username'
    And I expect '[data-cy="users_table"] tbody tr td.user-email' is 'test@test.com'
