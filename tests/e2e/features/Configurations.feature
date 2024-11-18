Feature: Test roundtrip of the application: Configurations

  ################## List configurations ##################
  ## 101 Should display all plugins and associated handler
  ## 102 Should display all handlers configurations

  ################## Action on handler and plugin #################
  ## 201 Should successfully create a plugin with an handler
  ## 202 Should successfully update a plugin with an handler
  ## 203 Should successfully delete a plugin with an handler

  Scenario: Roundtrip about Configurations
    Given I visit the '/'
    And   I set viewport size to '1536' px for width and '960' px for height

    When  I click on '[data-cy="drawer_item_ai"]'
    Then  I expect current url is '/ai'

    ####################################################
    ################## List configurations #############
    ####################################################

  ## 101 Should display all plugins and associated handler
    And   I expect '[data-cy="default-AI-configuration-card"] [data-cy="select-plugin1"]' exists
    And   I expect '[data-cy="default-AI-configuration-card"] [data-cy="select-plugin1"]' is "handler1"
    And   I expect '[data-cy="default-AI-configuration-card"] [data-cy="select-plugin2"]' exists
    And   I expect '[data-cy="default-AI-configuration-card"] [data-cy="select-plugin2"]' is "handler2"

  ## 102 Should display all handlers configurations
    And   I expect '[data-cy="handler1_custom-AI-configuration-card"]' exists
    And   I expect field '[data-cy="input_handler1_key1"]' is 'value1'
    And   I expect '[data-cy="expansion-item_handler1_plugin1"]' exists
    And   I expect '[data-cy="expansion-item_handler1_plugin2"]' exists

    And   I expect '[data-cy="handler2_custom-AI-configuration-card"]' exists
    And   I expect field '[data-cy="input_handler2_key2"]' is 'value2'
    And   I expect '[data-cy="expansion-item_handler2_plugin1"]' exists
    And   I expect '[data-cy="expansion-item_handler2_plugin2"]' exists

    ####################################################
    ################## Action on handler and plugin ####
    ####################################################

  ## 201 Should successfully create a plugin with an handler
    When I set on '[data-cy="input-new-plugin-name"]' text 'plugin3'
    And  I select '[data-cy="item_handler1"]' in '[data-cy="select-new-plugin-handler"]'
    And  I click on '[data-cy="default-AI-configuration-card"] [data-cy="button_save-plugin"]'
    Then I expect 'positive' toast to appear with text 'Configuration is added.'

  ## 202 Should successfully update a plugin with an handler
    When I select '[data-cy="item_handler2"]' in '[data-cy="select-plugin1"]'
    And  I click on '[data-cy="default-AI-configuration-card"] [data-cy="button_update"]'
    Then I expect 'positive' toast to appear with text 'Configuration is updated.'

  ## 203 Should successfully delete a plugin with an handler
    When I click on '[data-cy="default-AI-configuration-card"] [data-cy="button_plugin1_delete"]'
    Then I expect 'positive' toast to appear with text 'Configuration is deleted.'
