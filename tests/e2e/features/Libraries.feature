Feature: Test roundtrip of the application: Libraries

  ################## List libraries ##################
  ## 101 Should display all libraries

  ################## Select library ##################
  ## 201 Should display all library information
  ## 202 Should redirect to libraries in library is not found

  Scenario: Roundtrip about Libraries
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_libraries"]'
    Then  I expect current url is '/libraries'

    ## 101 Should display all libraries
    And I expect '[data-cy="libraries_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="libraries_table"] tbody tr:nth-child(1) td.library-name' is 'lib1'
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_1_button_show"]' exists
    And I expect '[data-cy="libraries_table"] tbody tr:nth-child(2) td.library-name' is 'lib2'
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_2_button_show"]' exists

    ## 201 Should display all library information
    When I click on '[data-cy="libraries_table"] [data-cy="library_id_1_button_show"]'
    Then I expect current url is '/libraries/id_1'
    And  I expect '[data-cy="page_library_loading"]' not exists
    And  I expect '[data-cy="page_library_title"]' is 'lib1'
    And  I expect '[data-cy="page_library_version"]' is '1.0.0'
    And  I expect '[data-cy="page_library_author"]' is 'Author_1'
    And  I expect '[data-cy="page_library_description"]' is 'description_1'

    When I click on '[data-cy="page_library_go_back"]'
    Then I expect current url is '/libraries'

    When I click on '[data-cy="libraries_table"] [data-cy="library_id_2_button_show"]'
    Then I expect current url is '/libraries/id_2'
    And  I expect '[data-cy="page_library_loading"]' not exists
    And  I expect '[data-cy="page_library_title"]' is 'lib2'
    And  I expect '[data-cy="page_library_version"]' is '2.0.0'
    And  I expect '[data-cy="page_library_author"]' is 'Author_2'
    And  I expect '[data-cy="page_library_description"]' is 'description_2'

    ## 202 Should redirect to libraries if library is not found
    When I visit the '/libraries/id_3'
    Then I expect current url is '/libraries$'
    And  I expect 'negative' toast to appear with text 'Library not found.'
