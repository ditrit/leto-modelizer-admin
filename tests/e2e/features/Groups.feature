Feature: Test roundtrip of the application: Groups

  ################## List groups ##################
  ## 101 Should display all groups

  ################## Select group ##################
  ## 201 Should display all groups information
  ## 202 Should redirect to groups if group is not found

  ################## Attach user ##################
  ## 301 Should disabled confirm button if no user is selected
  ## 302 Should select and successfully attach a user

  ################## Delete group ##################
  ## 401 Should delete selected group

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
    And  I expect '[data-cy="page_group_users_title"]' exists
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-name' is 'Admin'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-login' is 'admin'

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

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ####################################################
    ################## Delete group ################
    ####################################################

    ## 401 Should delete selected group
    When I click on '[data-cy="group_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Group is removed.'
