Feature: Test roundtrip of the application: Secrets

  ################## List Secrets ##################
  ## 101 Should display all secrets

  ################## Filter secret #################
  ## 201 Should change url on filter key

  ################## Add secret ##################
  ## 301 Should successfully add a secret

  ################## Edit secret ##################
  ## 401 Should successfully edit a secret

  ################## Remove secret ##################
  ## 501 Should successfully remove a secret

  Scenario: Roundtrip about Secrets
    Given I visit the '/'

    When  I click on '[data-cy="drawer_item_ai"]'
    Then  I expect current url is '/ai'

    When I click on '[data-cy="page_ai-settings_secrets_tab"]'
    Then  I expect current url is '/ai\?tab=secrets'
    And   I set viewport size to '1536' px for width and '960' px for height

    ####################################################
    ################## List secrets ####################
    ####################################################

    ## 101 Should display all secrets
    And I expect '[data-cy="secrets_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="secrets_table"] tbody tr:nth-child(1) td.secret-key' is 'SONAR_TOKEN'

    And I expect '[data-cy="secrets_table"] tbody tr:nth-child(2) td.secret-key' is 'GEMINI_TOKEN'

    ####################################################
    ################## Filter key ######################
    ####################################################

    ## 201 Should change url on filter name
    When I set on '[data-cy="secret_filter_key"]' text 'SONAR'
    And  I wait 2 seconds
    Then I expect current url is 'ai\?tab=secrets&key=SONAR'
    And I expect '[data-cy="secrets_table"] tbody tr' appear 1 times on screen
    And I expect '[data-cy="secrets_table"] tbody tr:nth-child(1) td.secret-key' is 'SONAR_TOKEN'

    ####################################################
    ################## Add secret ######################
    ####################################################

    ## 301 Should successfully add a secret
    When I click on '[data-cy="secrets_button_add"]'
    Then I expect '[data-cy="add-secret-dialog"]' exists

    When I set on '[data-cy="secret_field_key"]' text 'key'
    And  I set on '[data-cy="secret_field_value"]' text 'value'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Secret is added.'

    ####################################################
    ################## Edit secret #####################
    ####################################################

    ## 401 Should successfully edit a secret
    When I click on '[data-cy="user_SONAR_TOKEN_button_edit"]'
    Then I expect '[data-cy="edit-secret-dialog"]' exists

    When I set on '[data-cy="secret_field_key"]' text 'key'
    And  I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Secret is updated.'

    ####################################################
    ################## Remove secret ###################
    ####################################################

    ## 301 Should successfully remove a secret
    When I click on '[data-cy="user_SONAR_TOKEN_button_remove"]'
    Then I expect '[data-cy="remove-secret-dialog"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Secret is deleted.'
