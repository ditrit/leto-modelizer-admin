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

  ################## Attach role ##################
  ## 501 Should disabled confirm button if no role is selected
  ## 502 Should select and successfully attach a role

  ################## Detach role ##################
  ## 601 Should successfully detach a role for a user
  ## 602 Should show warning when deleting admin access to the current user
  ## 603 Should detach admin role for the current user

  ################## Delete user ##################
  ## 701 Should delete selected user
  ## 702 Should delete current user

  ################## Filter user #################
  ## 801 Should change url on filter name
  ## 802 Should change url on filter login
  ## 803 Should change url on filter email

  Scenario: Roundtrip about Users
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_users"]'
    Then  I expect current url is '/users'
    And   I set viewport size to '1536' px for width and '960' px for height

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

    # Display related groups
    And  I expect '[data-cy="groups_tab_panel"]' exists
    And  I expect '[data-cy="groups_title"]' exists
    And  I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'

    # Display related roles
    When I click on '[data-cy="page_user_roles_tab"]'
    Then I expect '[data-cy="page_user_roles_tab"]' exists
    And  I expect '[data-cy="roles_tab_panel"]' exists
    And  I expect '[data-cy="roles_title"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'SUPER_ADMINISTRATOR'

    # Display related permissions
    When I click on '[data-cy="page_user_permissions_tab"]'
    Then I expect '[data-cy="page_user_permissions_tab"]' exists
    And  I expect '[data-cy="permissions_tab_panel"]' exists
    And  I expect '[data-cy="permissions_title"]' exists
    And  I expect '[data-cy="permissions_table"]' exists
    And  I expect '[data-cy="permissions_table"] tbody tr:nth-child(1) td.permission-entity' is 'Project'
    And  I expect '[data-cy="permissions_table"] tbody tr:nth-child(1) td.permission-action' is 'Create'

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
    And  I wait 1 second

    When I click on '[data-cy="page_user_groups_tab"]'
    Then I expect '[data-cy="groups_tab_panel"]' exists

    When I click on '[data-cy="button_attach_group"]'
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
    When I click on '[data-cy="group_1_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is detached from user.'

    ####################################################
    ################## Attach role ##################
    ####################################################

    ## 501 Should disabled confirm button if no role is selected
    When I click on '[data-cy="page_user_roles_tab"]'
    Then I expect '[data-cy="roles_tab_panel"]' exists

    When I click on '[data-cy="button_attach_role"]'
    Then I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'Administrator'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 502 Should select and successfully attach a role
    When I click on '[data-cy="roles_table"] tbody tr:nth-child(2) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="roles_table"] tbody tr.selected td.role-name' is 'Administrator'

    When I force click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role(s) successfully attached to the user.'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ####################################################
    ################## Detach role ##################
    ####################################################

    ## 601 Should successfully detach a role for a user
    When I click on '[data-cy="users_table"] [data-cy="user_login_button_show"]'
    Then I expect current url is '/users/login'

    When I click on '[data-cy="page_user_roles_tab"]'
    And  I click on '[data-cy="role_3_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from user.'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ## 602 Should show warning when deleting admin access to the current user
    When I click on '[data-cy="users_table"] [data-cy="user_admin_button_show"]'
    Then I expect current url is '/users/admin'

    When I click on '[data-cy="page_user_roles_tab"]'
    And  I click on '[data-cy="role_1_button_detach"]'
    Then I expect '[data-cy="remove_current_user_warning"]' exists

    ## 603 Should detach admin role for the current user
    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from user.'

    When I click on '[data-cy="page_user_go_back"]'
    Then I expect current url is '/users'

    ####################################################
    ################## Delete user ##################
    ####################################################

    ## 701 Should delete selected user
    When I click on '[data-cy="user_login_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is removed.'

    ## 702 Should delete current user
    # When I click on '[data-cy="user_admin_button_remove"]'
    # Then I expect '[data-cy="button_confirm"]' exists
    # And  I expect '[data-cy="remove_current_user_warning"]' exists

    # When I click on '[data-cy="button_confirm"]'
    # Then I expect current url is '/api/logout'

    ####################################################
    ################## Filter user ################
    ####################################################

    ## 801 Should change url on filter name
    When I set on '[data-cy="user_filter_name"]' text 'admin'
    And  I wait 2 seconds
    Then I expect current url is 'users\?name=admin'

    ## 802 Should change url on filter login
    When I set on '[data-cy="user_filter_name"]' text ''
    And  I set on '[data-cy="user_filter_login"]' text 'login'
    And  I wait 2 seconds
    Then I expect current url is 'users\?login=login'

    ## 803 Should change url on filter email
    When I set on '[data-cy="user_filter_login"]' text ''
    And  I set on '[data-cy="user_filter_email"]' text 'test'
    And  I wait 2 seconds
    Then I expect current url is 'users\?email=test'
