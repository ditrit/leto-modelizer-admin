Feature: Test roundtrip of the application: Groups

  ################## List groups ##################
  ## 101 Should display all groups

  ################## Select group ##################
  ## 201 Should display all groups information
  ## 202 Should redirect to groups if group is not found

  ################## Attach user ##################
  ## 301 Should disabled confirm button if no user is selected
  ## 302 Should select and successfully attach a user

  ################## Detach user ##################
  ## 401 Should successfully detach a user

  ################## Attach group ##################
  ## 501 Should disabled confirm button if no group is selected
  ## 502 Should select and successfully attach a group

  ################## Detach group ##################
  ## 601 Should successfully detach a group

  ################## Attach role ##################
  ## 701 Should disabled confirm button if no role is selected
  ## 702 Should select and successfully attach a role

  ################## Detach role ##################
  ## 801 Should successfully detach a role

  ################## Delete group ##################
  ## 901 Should delete selected group

  Scenario: Roundtrip about Groups
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_groups"]'
    Then  I expect current url is '/groups'

    ####################################################
    ################## List groups #################
    ####################################################

    ## 101 Should display all groups
    And I expect '[data-cy="groups_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'
    And I expect '[data-cy="groups_table"] tbody tr:nth-child(2) td.group-name' is 'Group 2'

    ####################################################
    ################## Select groups ###############
    ####################################################

    ## 201 Should display all groups information
    When I click on '[data-cy="groups_table"] [data-cy="group_1_button_show"]'
    Then I expect current url is '/groups/1'
    And  I expect '[data-cy="page_group_loading"]' not exists
    And  I expect '[data-cy="page_group_title"]' is 'Group 1'

    # Display related users
    And  I expect '[data-cy="page_group_users_tab"]' exists
    And  I expect '[data-cy="page_group_users_tab_panel"]' exists
    And  I expect '[data-cy="page_group_users_title"]' exists
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'

    # Display related groups
    When I click on '[data-cy="page_group_groups_tab"]'
    Then I expect '[data-cy="page_group_groups_tab_panel"]' exists
    And  I expect '[data-cy="page_group_groups_title"]' exists
    And  I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'

    # Display related roles
    When I click on '[data-cy="page_group_roles_tab"]'
    Then I expect '[data-cy="page_group_roles_tab_panel"]' exists
    And  I expect '[data-cy="page_group_roles_title"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Super administrator'

    # Display related permissions
    When I click on '[data-cy="page_group_permissions_tab"]'
    Then I expect '[data-cy="page_group_permissions_tab_panel"]' exists
    And  I expect '[data-cy="page_group_permissions_title"]' exists
    And  I expect '[data-cy="permissions_table"]' exists

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ## 202 Should redirect to groups if group is not found
    When I visit the '/groups/unknown'
    Then I expect current url is '/groups'
    And  I expect 'negative' toast to appear with text 'Group not found.'

    ####################################################
    ################## Attach user ##################
    ####################################################

    ## 301 Should disabled confirm button if no user is selected
    When I click on '[data-cy="groups_table"] [data-cy="group_2_button_show"]'
    Then I expect current url is '/groups/2'

    When I click on '[data-cy="page_group_button_attach_user"]'
    Then I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 302 Should select and successfully attach a user
    When I click on '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="users_table"] tbody tr.selected td.user-name' is 'Admin'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User(s) successfully attached to the group.'

    ####################################################
    ################## Detach user ##################
    ####################################################

    ## 401 Should successfully detach a user
    When I click on '[data-cy="user_admin_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is detached from group.'

    ####################################################
    ################## Attach group #################
    ####################################################

    ## 501 Should disabled confirm button if no group is selected
    When I click on '[data-cy="page_group_groups_tab"]'
    Then I expect '[data-cy="page_group_groups_tab_panel"]' exists

    When I click on '[data-cy="page_group_button_attach_group"]'
    Then I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 502 Should select and successfully attach a group
    When I click on '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="groups_table"] tbody tr.selected td.group-name' is 'Group 1'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group(s) successfully attached to the group.'

    ####################################################
    ################## Detach group #################
    ####################################################

    ## 601 Should successfully detach a group
    When I click on '[data-cy="group_1_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is detached from group.'

    ####################################################
    ################## Attach role ##################
    ####################################################

    ## 701 Should disabled confirm button if no role is selected
    When I click on '[data-cy="page_group_roles_tab"]'
    Then I expect '[data-cy="page_group_roles_tab_panel"]' exists

    When I click on '[data-cy="page_group_button_attach_role"]'
    Then I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Administrator'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'Developer'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 702 Should select and successfully attach a role
    When I click on '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="roles_table"] tbody tr.selected td.role-name' is 'Administrator'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role(s) successfully attached to the group.'

    ####################################################
    ################## Detach role ##################
    ####################################################

    ## 801 Should successfully detach a role
    When I click on '[data-cy="role_3_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from group.'

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ####################################################
    ################## Delete group ################
    ####################################################

    ## 901 Should delete selected group
    When I click on '[data-cy="group_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is removed.'
