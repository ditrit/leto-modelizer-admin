Feature: Test roundtrip of the application: Roles

  ################## List roles ##################
  ## 101 Should display all roles

  ################## Select role #################
  ## 201 Should display related users
  ## 202 Should change url on filter user name attached to the role
  ## 203 Should display related groups
  ## 204 Should change url on filter group name attached to the role
  ## 205 Should display related roles
  ## 206 Should change url on filter role name attached to the role
  ## 207 Should display related permissions
  ## 208 Should change url on filter permission entity attached to the role
  ## 209 Should redirect to roles if role is not found

  ################## Attach user #################
  ## 301 Should disabled confirm button if no user is selected
  ## 302 Should select and successfully attach a user

  ################## Detach user #################
  ## 401 Should successfully detach a user

  ################## Attach group ################
  ## 501 Should disabled confirm button if no group is selected
  ## 502 Should select and successfully attach a group

  ################## Detach group ################
  ## 601 Should successfully detach a group

  ################## Attach role ################
  ## 701 Should disabled confirm button if no role is selected
  ## 702 Should select and successfully attach a role

  ################## Detach role ################
  ## 801 Should successfully detach a role

  ################## Attach permission ###########
  ## 901 Should disabled confirm button if no permission is selected
  ## 902 Should select and successfully attach a permission

  ################## Detach permission ###########
  ## 1001 Should successfully detach a permission

  ################## Delete role #################
  ## 1101 Should delete selected role
  ## 1102 Should not be able to delete super admin role

  ################## Filter role #################
  ## 1201 Should change url on filter name

  Scenario: Roundtrip about Roles
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_roles"]'
    Then  I expect current url is '/roles'
    And   I set viewport size to '1536' px for width and '960' px for height

    ####################################################
    ################## List roles #################
    ####################################################

    ## 101 Should display all roles
    And I expect '[data-cy="roles_table"] tbody tr' appear 3 times on screen
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'SUPER_ADMINISTRATOR'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(2) td.role-name' is 'Administrator'
    And I expect '[data-cy="roles_table"] tbody tr:nth-child(3) td.role-name' is 'Developer'

    ####################################################
    ################## Select roles ###############
    ####################################################

    When I click on '[data-cy="roles_table"] [data-cy="role_2_button_show"]'
    Then I expect current url is '/roles/2\?tab=users'
    And  I expect '[data-cy="page_role_loading"]' not exists
    And  I expect '[data-cy="page_role_title"]' exists

    ## 201 Should display related users
    And  I expect '[data-cy="page_role_users_tab"]' exists
    And  I expect '[data-cy="users_tab_panel"]' exists
    And  I expect '[data-cy="users_title"]' exists
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'

    ## 202 Should change url on filter user login attached to the role
    When I set on '[data-cy="user_filter_login"]' text 'test'
    Then I expect current url is 'roles/2\?tab=users&login=test'

    ## 203 Should display related groups
    When I click on '[data-cy="page_role_groups_tab"]'
    Then I expect current url is 'roles/2\?tab=groups'
    And  I expect '[data-cy="groups_tab_panel"]' exists
    And  I expect '[data-cy="groups_title"]' exists
    And  I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'

    ## 204 Should change url on filter group name attached to the role
    When I set on '[data-cy="group_filter_name"]' text 'test'
    And  I wait 1 second
    Then I expect current url is 'roles/2\?tab=groups&name=test'

    ## 205 Should display related roles
    When I click on '[data-cy="page_role_roles_tab"]'
    Then I expect current url is 'roles/2\?tab=roles'
    And  I expect '[data-cy="roles_tab_panel"]' exists
    And  I expect '[data-cy="roles_title"]' exists
    And  I expect '[data-cy="roles_table"]' exists
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Developer'

    ## 206 Should change url on filter role name attached to the role
    When I set on '[data-cy="role_filter_name"]' text 'test'
    And  I wait 1 second
    Then I expect current url is 'roles/2\?tab=roles&name=test'

    ## 207 Should display related permissions
    When I click on '[data-cy="page_role_permissions_tab"]'
    Then I expect current url is 'roles/2\?tab=permissions'
    And  I expect '[data-cy="permissions_tab_panel"]' exists
    And  I expect '[data-cy="permissions_title"]' exists
    And  I expect '[data-cy="permissions_table"]' exists
    And  I expect '[data-cy="permissions_table"] tbody tr:nth-child(1) td.permission-entity' is 'Project'

    ## 208 Should change url on filter permission action attached to the role
    When I select '[data-cy="permission_action_Create"]' in '[data-cy="permission_filter_action"]'
    And  I wait 1 second
    Then I expect current url is 'roles/2\?tab=permissions&action=CREATE'

    ## 209 Should redirect to roles if role is not found
    When I visit the '/roles/unknown'
    Then I expect current url is '/roles'
    And  I expect 'negative' toast to appear with text 'Role not found.'

    ####################################################
    ################## Attach user ###############
    ####################################################

    ## 301 Should disabled confirm button if no user is selected
    When I click on '[data-cy="roles_table"] [data-cy="role_2_button_show"]'
    Then I expect current url is '/roles/2'
    And  I wait 1 second

    When I click on '[data-cy="page_role_users_tab"]'
    Then I expect '[data-cy="users_tab_panel"]' exists

    When I click on '[data-cy="button_attach_user"]'
    Then I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(2) td.user-name' is 'Name'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(2) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 302 Should select and successfully attach a user
    When I click on '[data-cy="users_table"] tbody tr:nth-child(2) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="users_table"] tbody tr.selected td.user-name' is 'Name'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User(s) successfully attached to the role.'

    ####################################################
    ################## Detach user ###############
    ####################################################

    ## 401 Should successfully detach a user
    When I click on '[data-cy="user_admin_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User is detached from role.'

    ####################################################
    ################## Attach group ###############
    ####################################################

    ## 501 Should disabled confirm button if no group is selected
    When I click on '[data-cy="page_role_groups_tab"]'
    Then I expect '[data-cy="groups_tab_panel"]' exists

    When I click on '[data-cy="button_attach_group"]'
    Then I expect '[data-cy="groups_table"]' exists
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td.group-name' is 'Group 1'
    And  I expect '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 502 Should select and successfully attach a group
    When I click on '[data-cy="groups_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="groups_table"] tbody tr.selected td.group-name' is 'Group 1'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group(s) successfully attached to the role.'

    ####################################################
    ################## Detach group ###############
    ####################################################

    ## 601 Should successfully detach a group
    When I click on '[data-cy="group_1_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from role.'

    ####################################################
    ################## Attach role ###############
    ####################################################

    ## 701 Should disabled confirm button if no role is selected
    When I click on '[data-cy="page_role_roles_tab"]'
    Then I expect '[data-cy="roles_tab_panel"]' exists

    When I click on '[data-cy="button_attach_role"]'
    Then I expect '[data-cy="roles_table"]' exists
    And  I wait 1 second
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td.role-name' is 'Developer'
    And  I expect '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 702 Should select and successfully attach a role
    When I click on '[data-cy="roles_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="roles_table"] tbody tr.selected td.role-name' is 'Administrator'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role(s) successfully attached to the role.'

    ####################################################
    ################## Detach role ###############
    ####################################################

    ## 801 Should successfully detach a role
    When I click on '[data-cy="role_3_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Role is detached from role.'

    ####################################################
    ################## Attach permission ##########
    ####################################################

    ## 901 Should disabled confirm button if no permission is selected
    When I click on '[data-cy="page_role_permissions_tab"]'
    Then I expect '[data-cy="permissions_tab_panel"]' exists

    When I click on '[data-cy="button_attach_permission"]'
    Then I expect '[data-cy="permissions_table"]' exists
    And  I expect '[data-cy="permissions_table"] tbody tr:nth-child(1) td.permission-entity' is 'Project'
    And  I expect '[data-cy="permissions_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 902 Should select and successfully attach a permission
    When I click on '[data-cy="permissions_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="permissions_table"] tbody tr.selected td.permission-entity' is 'Project'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Permission(s) successfully attached to the role.'

    ####################################################
    ################## Detach permission ##########
    ####################################################

    ## 1001 Should successfully detach a permission
    When I click on '[data-cy="permission_1_button_detach"]'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Permission is detached from role.'

    When I click on '[data-cy="page_role_go_back"]'
    Then I expect current url is '/roles'

    ####################################################
    ################## Delete role ################
    ####################################################

    ## 1101 Should delete selected role
    When I click on '[data-cy="role_2_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Permission is removed.'

    ## 1102 Should not be able to delete super admin role
    When I click on '[data-cy="role_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'negative' toast to appear with text 'Error during role deletion.'

    ####################################################
    ################## Filter role ################
    ####################################################

    ## 1201 Should change url on filter name
    When I set on '[data-cy="role_filter_name"]' text 'test'
    And  I wait 2 seconds
    Then I expect current url is 'roles\?name=test'
