Feature: Test roundtrip of the application: Users

  ################## List Users ##################
  ## 101 Should display all users

  ################## Select user ##################
  ## 201 Should display all users information
  ## 202 Should redirect to users if user is not found

  ################## Attach group ##################
  ## 301 Should disabled confirm button if no group is selected
  ## 302 Should select and successfully attach a group

  ################## Detach group ##################
  ## 401 Should successfully detach a group

  ################## Delete user ##################
  ## 501 Should delete selected user
  ## 502 Should delete current user

  Scenario: Roundtrip about Users
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_users"]'
    Then  I expect current url is '/users'

    ####################################################
    ################## List users #################
    ####################################################

    ## 101 Should display all users
    And I expect '[data-cy="users_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-email' is 'admin@admin.com'

    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-name' is 'Name'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-login' is 'login'
    And I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-email' is 'test@test.com'

    ####################################################
    ################## Select users ###############
    ####################################################

    ## 201 Should display all users information
    When I click on '[data-cy="users_table"] [data-cy="user_admin_button_show"]'
    Then I expect current url is '/users/admin'
    And  I expect '[data-cy="page_user_loading"]' not exists
    And  I expect '[data-cy="page_user_title"]' is 'Admin'
    # Display related roles
    And  I expect '[data-cy="page_user_roles_title"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Super administrator'
    # Display related groups
    And  I expect '[data-cy="page_user_groups_title"]' exists
    And  I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ## 202 Should redirect to users if user is not found
    When I visit the '/users/unknown'
    Then I expect current url is '/users'
    And  I expect 'negative' toast to appear with text 'User not found.'

    ####################################################
    ################## Attach group ##################
    ####################################################

    ## 301 Should disabled confirm button if no group is selected
    When I click on '[data-cy="users_table"] [data-cy="user_admin_button_show"]'
    Then I expect current url is '/users/admin'

    When I click on '[data-cy="page_user_button_attach_group"]'
    Then I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(2) td.group-name' is 'Group 2'
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(2) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 302 Should select and successfully attach a group
    When I click on '[data-cy="groups_table"] tbody tr:nth-child(2) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="groups_table"] tbody tr.selected td.group-name' is 'Group 2'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group(s) successfully attached to the user.'

    ####################################################
    ################## Detach group ##################
    ####################################################

    ## 401 Should successfully detach a group
    When I click on '[data-cy="group_1_button_remove"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is removed from user.'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ####################################################
    ################## Delete user ##################
    ####################################################

    ## 501 Should delete selected user
    When I click on '[data-cy="user_login_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is removed.'

    ## 502 Should delete current user
    When I click on '[data-cy="user_admin_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists
    And  I expect '[data-cy="remove_current_user_warning"]' exists

    # When I click on '[data-cy="button_confirm"]'
    # Then I expect current url is '/api/logout'
