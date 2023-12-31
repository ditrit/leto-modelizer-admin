Feature: Test roundtrip of the application: UserGroups

  ################## List UserGroups ##################
  ## 101 Should display all userGroups

  ################## Select userGroup ##################
  ## 201 Should display all userGroups information
  ## 202 Should redirect to userGroups if userGroup is not found

  ################## Delete userGroup ##################
  ## 301 Should delete selected userGroup

  Scenario: Roundtrip about UserGroups
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_userGroups"]'
    Then  I expect current url is '/user-groups'

    ####################################################
    ################## List userGroups #################
    ####################################################

    ## 101 Should display all userGroups
    And I expect '[data-cy="userGroups_table"] tbody tr' appear 1 time on screen
    And I expect '[data-cy="userGroups_table"] tbody tr td' is 'group'

    ####################################################
    ################## Select userGroups ###############
    ####################################################

    ## 201 Should display all userGroups information
    When I click on '[data-cy="userGroups_table"] [data-cy="userGroup_id_1_button_show"]'
    Then I expect current url is '/user-groups/id_1'
    And  I expect '[data-cy="page_userGroup_loading"]' not exists
    And  I expect '[data-cy="page_userGroup_title"]' is 'group1'

    When I click on '[data-cy="page_userGroup_go_back"]'
    Then I expect current url is '/user-groups'

    ## 202 Should redirect to userGroups if userGroup is not found
    When I visit the '/user-groups/id_3'
    Then I expect current url is '/user-groups$'
    And  I expect 'negative' toast to appear with text 'Group not found.'

    ####################################################
    ################## Delete userGroup ################
    ####################################################

    ## 301 Should delete selected userGroup
    When I click on '[data-cy="userGroup_id_1_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'UserGroup is removed.'
    And  I expect '[data-cy="userGroups_table"] tbody tr' appear 0 time on screen
