Feature: Test roundtrip of the application: Groups

  ################## List groups ##################
  ## 101 Should display all groups

  ################## Add group ####################
  ## 201 Should redirect to AddGroup page
  ## 202 Should redirect to groups page on cancel
  ## 203 Should disabled confirm button if name is empty, no user or role are selected
  ## 204 Should display an error on wrong group name format
  ## 205 Should create group and go to its page

  ################## Select group ##################
  ## 301 Should display all groups information
  ## 302 Should redirect to groups if group is not found

  ################## Attach user ##################
  ## 401 Should disabled confirm button if no user is selected
  ## 402 Should select and successfully attach a user

  ################## Detach user ##################
  ## 501 Should successfully detach a user

  ################## Attach group ##################
  ## 601 Should disabled confirm button if no group is selected
  ## 602 Should select and successfully attach a group

  ################## Detach group ##################
  ## 701 Should successfully detach a group

  ################## Attach role ##################
  ## 801 Should disabled confirm button if no role is selected
  ## 802 Should select and successfully attach a role

  ################## Detach role ##################
  ## 901 Should successfully detach a role

  ################## Delete group ##################
  ## 1001 Should delete selected group

  ################## Filter group #################
  ## 1101 Should change url on filter name

  Scenario: Roundtrip about Groups
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_groups"]'
    Then  I expect current url is '/groups'
    And   I set viewport size to '1536' px for width and '960' px for height

    ####################################################
    ################## List groups #################
    ####################################################

    ## 101 Should display all groups
    And I expect '[data-cy="groups_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'
    And I expect '[data-cy="groups_table"] tbody tr:nth-child(2) td.group-name' is 'Group 2'

    ####################################################
    ################## Add group #################
    ####################################################

    ## 201 Should redirect to AddGroup page
    When I click on '[data-cy="groups_button_add"]'
    Then I expect current url is '/add-group'
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] [data-cy="users_table_no_data"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] [data-cy="roles_table_no_data"]' exists

    ## 202 Should redirect to groups page on cancel
    When I force click on '[data-cy="group_button_cancel"]'
    Then I expect current url is '/groups'

    ## 203 Should disabled confirm button if name is empty, no user or role are selected
    When I click on '[data-cy="groups_button_add"]'
    Then I expect '[data-cy="group_button_add"]' to be disabled

    ## 204 Should display an error on wrong group name format
    When I set on '[data-cy="group-field-name"]' text 'r'
    Then I expect '.group-field-name div[role="alert"]' is 'Must start and end with a capital letter/number, use uppercase letters, numbers, _, or -'

    ## 205 Should create group and go to its page
    When I set on '[data-cy="group-field-name"]' text 'GROUP'

    # Select a user
    And  I click on '[data-cy="page_add_group_button_attach_user"]'
    Then I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-name' is 'Name'

    When I click on '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="users_table"] tbody tr.selected td.user-name' is 'Admin'

    When I click on '[data-cy="button_confirm"]'
    Then I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] [data-cy="users_table_no_data"]' not exists

    # Select a role
    When I click on '[data-cy="page_add_group_button_attach_role"]'
    Then I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Administrator'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'Developer'

    When I click on '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="roles_table"] tbody tr.selected td.role-name' is 'Administrator'

    When I click on '[data-cy="button_confirm"]'
    Then I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Administrator'
    And  I expect '[data-cy="roles_table"] [data-cy="roles_table_no_data"]' not exists
    And  I expect '[data-cy="group_button_add"]' to be enabled

    # Create group
    When I click on '[data-cy="group_button_add"]'
    Then I expect current url is '/groups/3'
    And  I expect 'positive' toast to appear with text 'Group is created.'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'

    When I click on '[data-cy="page_group_roles_tab"]'
    Then I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Developer'

    ####################################################
    ################## Select groups ###############
    ####################################################

    ## 301 Should display all groups information
    When I click on '[data-cy="page_group_go_back"]'
    And  I click on '[data-cy="groups_table"] [data-cy="group_1_button_show"]'
    Then I expect current url is '/groups/1'
    And  I expect '[data-cy="page_group_loading"]' not exists
    And  I expect '[data-cy="page_group_title"]' is 'Group 1'

    # Display related users
    And  I expect '[data-cy="page_group_users_tab"]' exists
    And  I expect '[data-cy="users_tab_panel"]' exists
    And  I expect '[data-cy="users_title"]' exists
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'

    # Display related groups
    When I click on '[data-cy="page_group_groups_tab"]'
    Then I expect '[data-cy="groups_tab_panel"]' exists
    And  I expect '[data-cy="groups_title"]' exists
    And  I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'

    # Display related roles
    When I click on '[data-cy="page_group_roles_tab"]'
    Then I expect '[data-cy="roles_tab_panel"]' exists
    And  I expect '[data-cy="roles_title"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Super administrator'

    # Display related permissions
    When I click on '[data-cy="page_group_permissions_tab"]'
    Then I expect '[data-cy="permissions_tab_panel"]' exists
    And  I expect '[data-cy="permissions_title"]' exists
    And  I expect '[data-cy="permissions_table"]' exists

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ## 302 Should redirect to groups if group is not found
    When I visit the '/groups/unknown'
    Then I expect current url is '/groups'
    And  I expect 'negative' toast to appear with text 'Group not found.'

    ####################################################
    ################## Attach user ##################
    ####################################################

    ## 401 Should disabled confirm button if no user is selected
    When I click on '[data-cy="groups_table"] [data-cy="group_2_button_show"]'
    And  I wait 1 second
    Then I expect current url is '/groups/2'

    When I click on '[data-cy="button_attach_user"]'
    Then I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 402 Should select and successfully attach a user
    When I click on '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="users_table"] tbody tr.selected td.user-name' is 'Admin'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User(s) successfully attached to the group.'

    ####################################################
    ################## Detach user ##################
    ####################################################

    ## 501 Should successfully detach a user
    When I click on '[data-cy="user_admin_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is detached from group.'

    ####################################################
    ################## Attach group #################
    ####################################################

    ## 601 Should disabled confirm button if no group is selected
    When I click on '[data-cy="page_group_groups_tab"]'
    Then I expect '[data-cy="groups_tab_panel"]' exists

    When I click on '[data-cy="button_attach_group"]'
    Then I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 602 Should select and successfully attach a group
    When I click on '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="groups_table"] tbody tr.selected td.group-name' is 'Group 1'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group(s) successfully attached to the group.'

    ####################################################
    ################## Detach group #################
    ####################################################

    ## 701 Should successfully detach a group
    When I click on '[data-cy="group_1_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Group is detached from group.'

    ####################################################
    ################## Attach role ##################
    ####################################################

    ## 801 Should disabled confirm button if no role is selected
    When I click on '[data-cy="page_group_roles_tab"]'
    Then I expect '[data-cy="roles_tab_panel"]' exists

    When I click on '[data-cy="button_attach_role"]'
    Then I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Administrator'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'Developer'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 802 Should select and successfully attach a role
    When I click on '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="roles_table"] tbody tr.selected td.role-name' is 'Administrator'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role(s) successfully attached to the group.'

    ####################################################
    ################## Detach role ##################
    ####################################################

    ## 901 Should successfully detach a role
    When I click on '[data-cy="role_3_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from group.'

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ####################################################
    ################## Delete group ################
    ####################################################

    ## 1001 Should delete selected group
    When I click on '[data-cy="group_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is removed.'

    ####################################################
    ################## Filter group ################
    ####################################################

    ## 1201 Should change url on filter name
    When I set on '[data-cy="group_filter_name"]' text 'test'
    And  I wait 2 seconds
    Then I expect current url is 'groups\?size=5&name=test'
