Feature: Test roundtrip of the application: Users

  ################## List Users ##################
  ## 101 Should display all users

  ################## Select user ##################
  ## 201 Should display all users information
  ## 202 Should redirect to users if user is not found

  ################## Delete user ##################
  ## 301 Should delete selected user
  ## 302 Should delete current user

  Scenario: Roundtrip about Users
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_users"]'
    Then  I expect current url is '/users'

    ####################################################
    ################## List users #################
    ####################################################

    ## 101 Should display all users
    And I expect '[data-cy="users_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-firstname' is 'Firstname'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-username' is 'Username'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-email' is 'test@test.com'

    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-firstname' is 'Admin'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-username' is 'Current User'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-email' is 'admin@admin.com'

    ####################################################
    ################## Select users ###############
    ####################################################

    ## 201 Should display all users information
    When I click on '[data-cy="users_table"] [data-cy="user_id_1_button_show"]'
    Then I expect current url is '/users/id_1'
    And  I expect '[data-cy="page_user_loading"]' not exists
    And  I expect '[data-cy="page_user_title"]' is 'Firstname'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ## 202 Should redirect to users if user is not found
    When I visit the '/users/id_3'
    Then I expect current url is '/users$'
    And  I expect 'negative' toast to appear with text 'User not found.'

    ####################################################
    ################## Delete user ##################
    ####################################################

    ## 301 Should delete selected user
    When I click on '[data-cy="user_id_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is removed.'
    And  I expect '[data-cy="users_table"] tbody tr' appear 1 time on screen
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-firstname' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-username' is 'Current User'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-email' is 'admin@admin.com'

    ## 302 Should delete current user
    When I click on '[data-cy="user_id_2_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists
    And  I expect '[data-cy="remove_current_user_warning"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect '[data-cy="users_table"] tbody tr' appear 0 time on screen
    And  I expect current url is '/token/clear'
