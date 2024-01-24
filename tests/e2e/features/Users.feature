Feature: Test roundtrip of the application: Users

  ################## List Users ##################
  ## 101 Should display all users

  ################## Select user ##################
  ## 201 Should display all users information and related groups
  ## 202 Should redirect to users if user is not found

  ################## Attach group ##################
  ## 301 Should disabled confirm button if no group is selected
  ## 302 Should select and successfully attach a group

  ################## Delete user ##################
  ## 401 Should delete selected user
  ## 402 Should delete current user

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

    ## 201 Should display all users information and related groups
    When I click on '[data-cy="users_table"] [data-cy="user_id_1_button_show"]'
    Then I expect current url is '/users/id_1'
    And  I expect '[data-cy="page_user_loading"]' not exists
    And  I expect '[data-cy="page_user_title"]' is 'Firstname'
    And  I expect '[data-cy="page_user_subtitle"]' exists
    And  I expect '[data-cy="userGroups_table"]' exists
    And  I expect '[data-cy="userGroups_table"] tbody tr:nth-child(1) td.user-group-name' is 'group1'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ## 202 Should redirect to users if user is not found
    When I visit the '/users/id_3'
    Then I expect current url is '/users$'
    And  I expect 'negative' toast to appear with text 'User not found.'

    ####################################################
    ################## Attach group ##################
    ####################################################

    ## 301 Should disabled confirm button if no group is selected
    When I click on '[data-cy="users_table"] [data-cy="user_id_1_button_show"]'
    Then I expect current url is '/users/id_1'

    When I click on '[data-cy="page_user_button_attach_group"]'
    Then I expect '[data-cy="userGroups_table"]' exists
    And  I expect '[data-cy="userGroups_table"] tbody tr:nth-child(1) td.user-group-name' is 'group1'
    And  I expect '[data-cy="userGroups_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 302 Should select and successfully attach a group
    When I click on '[data-cy="userGroups_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="userGroups_table"] tbody tr.selected td.user-group-name' is 'group1'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group(s) successfully attached to the user.'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ####################################################
    ################## Delete user ##################
    ####################################################

    ## 401 Should delete selected user
    When I click on '[data-cy="user_id_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is removed.'
    And  I expect '[data-cy="users_table"] tbody tr' appear 1 time on screen
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-firstname' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-username' is 'Current User'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-email' is 'admin@admin.com'

    ## 402 Should delete current user
    When I click on '[data-cy="user_id_2_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists
    And  I expect '[data-cy="remove_current_user_warning"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect '[data-cy="users_table"] tbody tr' appear 0 time on screen
    And  I expect current url is '/token/clear'
