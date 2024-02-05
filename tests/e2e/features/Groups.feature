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
    And I expect '[data-cy="groups_table"] tbody tr' appear 1 time on screen
    And I expect '[data-cy="groups_table"] tbody tr td' is 'group'

    ####################################################
    ################## Select groups ###############
    ####################################################

    ## 201 Should display all groups information
    When I click on '[data-cy="groups_table"] [data-cy="group_id_1_button_show"]'
    Then I expect current url is '/groups/id_1'
    And  I expect '[data-cy="page_group_loading"]' not exists
    And  I expect '[data-cy="page_group_title"]' is 'group1'
    # Display related users
    And  I expect '[data-cy="page_group_users_title"]' exists
    And  I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-firstname' is 'Firstname'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-username' is 'Username'

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ## 202 Should redirect to groups if group is not found
    When I visit the '/groups/id_3'
    Then I expect current url is '/groups$'
    And  I expect 'negative' toast to appear with text 'Group not found.'

    ####################################################
    ################## Attach user ##################
    ####################################################

    ## 301 Should disabled confirm button if no user is selected
    When I click on '[data-cy="groups_table"] [data-cy="group_id_1_button_show"]'
    Then I expect current url is '/groups/id_1'

    When I click on '[data-cy="page_group_button_attach_user"]'
    Then I expect '[data-cy="users_table"]' exists
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-firstname' is 'Firstname'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td.user-username' is 'Username'
    And  I expect '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]' exists
    And  I expect '[data-cy="button_confirm"]' to be disabled

    ## 302 Should select and successfully attach a user
    When I click on '[data-cy="users_table"] tbody tr:nth-child(1) td [role="checkbox"]'
    Then I expect '[data-cy="button_confirm"]' to be enabled
    And  I expect '[data-cy="users_table"] tbody tr.selected td.user-firstname' is 'Firstname'

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'User(s) successfully attached to the group.'

    When I click on '[data-cy="page_group_go_back"]'
    Then I expect current url is '/groups'

    ####################################################
    ################## Delete group ################
    ####################################################

    ## 401 Should delete selected group
    When I click on '[data-cy="group_id_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'group is removed.'
    And  I expect '[data-cy="groups_table"] tbody tr' appear 0 time on screen
