Feature: Test roundtrip of the application: Libraries

  ################## List libraries ##################
  ## 101 Should display all libraries

  ################## Select library ##################
  ## 201 Should display all library information
  ## 202 Should redirect to libraries in library is not found

  ################## Delete library ##################
  ## 301 Should delete selected library

  ################## Add library ##################
  ## 401 Should redirect to AddLibrary page
  ## 402 Should redirect to libraries page on cancel
  ## 403 Should display an error on empty library url
  ## 404 Should display an error on wrong library role name format
  ## 405 Should display an error on duplicate library url
  ## 406 Should display an error on duplicate library role name
  ## 407 Should display an error on not found library url
  ## 408 Should create library and go to its page

  ################## Synchronize library ##################
  ## 501 Should display an error on empty library url
  ## 502 Should display an error on not found library url
  ## 503 Should display an error on duplicate library url
  ## 504 Should Synchronize library

  Scenario: Roundtrip about Libraries
    Given I visit the '/'
    When  I click on '[data-cy="drawer_item_libraries"]'
    Then  I expect current url is '/libraries'

    ####################################################
    ################## List libraries ##################
    ####################################################

    ## 101 Should display all libraries
    And I expect '[data-cy="libraries_table"] tbody tr' appear 2 times on screen
    And I expect '[data-cy="libraries_table"] tbody tr:nth-child(1) td.library-name' is 'lib1'
    And I expect '[data-cy="libraries_table"] [data-cy="library_1_button_show"]' exists
    And I expect '[data-cy="libraries_table"] [data-cy="library_1_button_remove"]' exists
    And I expect '[data-cy="libraries_table"] tbody tr:nth-child(2) td.library-name' is 'lib2'
    And I expect '[data-cy="libraries_table"] [data-cy="library_2_button_show"]' exists
    And I expect '[data-cy="libraries_table"] [data-cy="library_2_button_remove"]' exists

    ####################################################
    ################## Select library ##################
    ####################################################

    ## 201 Should display all library information
    When I click on '[data-cy="libraries_table"] [data-cy="library_1_button_show"]'
    Then I expect current url is '/libraries/1'
    And  I expect '[data-cy="page_library_loading"]' not exists
    And  I expect '[data-cy="page_library_title"]' is 'lib1'
    And  I expect '[data-cy="page_library_version"]' is '1.0.0'
    And  I expect '[data-cy="page_library_maintainer"]' is 'Maintainer_1'
    And  I expect '[data-cy="page_library_description"]' is 'description_1'

    When I click on '[data-cy="page_library_go_back"]'
    Then I expect current url is '/libraries'

    When I click on '[data-cy="libraries_table"] [data-cy="library_2_button_show"]'
    Then I expect current url is '/libraries/2'
    And  I expect '[data-cy="page_library_loading"]' not exists
    And  I expect '[data-cy="page_library_title"]' is 'lib2'
    And  I expect '[data-cy="page_library_version"]' is '2.0.0'
    And  I expect '[data-cy="page_library_maintainer"]' is 'Maintainer_2'
    And  I expect '[data-cy="page_library_description"]' is 'description_2'

    ## 202 Should redirect to libraries if library is not found
    When I visit the '/libraries/3'
    Then I expect current url is '/libraries'
    And  I expect 'negative' toast to appear with text 'Library not found.'

    ####################################################
    ################## Delete library ##################
    ####################################################

    ## 301 Should delete selected library
    When I click on '[data-cy="library_2_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Library is removed.'

    ####################################################
    ################## Add library    ##################
    ####################################################

    ## 401 Should redirect to AddLibrary page
    When I click on '[data-cy="libraries_button_add"]'
    Then I expect current url is '/add-library'

    ## 402 Should redirect to libraries page on cancel
    When I force click on '[data-cy="library_button_cancel"]'
    Then I expect current url is '/libraries'

    ## 403 Should display an error on empty library url
    When I click on '[data-cy="libraries_button_add"]'
    And  I click on '[data-cy="library_button_add"]'
    Then I expect '.library-field-role div[role="alert"]' not exists
    And  I expect '.library-field-url div[role="alert"]' is 'Field is required'

    ## 404 Should display an error on wrong library role name format
    When I set on '[data-cy="library_field_role"]' text 'r'
    Then I expect '.library-field-role div[role="alert"]' is 'Must start and end with a capital letter/number, use uppercase letters, numbers, _, or -'

    ## 405 Should display an error on duplicate library url
    When I set on '[data-cy="library_field_url"]' text 'alreadyExist'
    And  I set on '[data-cy="library_field_role"]' text ''
    And  I click on '[data-cy="library_button_add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url already exists.'

    ## 406 Should display an error on not found library url
    When I set on '[data-cy="library_field_url"]' text 'notFound'
    And  I click on '[data-cy="library_button_add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-role div[role="alert"]' not exists
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url can not be downloaded.'

    ## 407 Should display an error on duplicate library role name
    When I set on '[data-cy="library_field_url"]' text 'valid'
    And  I set on '[data-cy="library_field_role"]' text 'ROLE-1'
    And  I click on '[data-cy="library_button_add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I expect '.library-field-role div[role="alert"]' is 'Library with this role already exists.'

    ## 408 Should create library and go to its page
    When I set on '[data-cy="library_field_url"]' text 'valid'
    And  I set on '[data-cy="library_field_role"]' text ''
    And  I click on '[data-cy="library_button_add"]'

    Then I expect current url is '/libraries/1'
    And  I expect 'positive' toast to appear with text 'Library is created.'
    And  I expect field '[data-cy="library_field_url"]' is 'url_1index.json'

    ####################################################
    ################## Synchronize library  ############
    ####################################################

    ## 501 Should display an error on empty library url
    When I set on '[data-cy="library_field_url"]' text ''
    Then I expect '.library-field-url div[role="alert"]' is 'Field is required'

    ## 502 Should display an error on not found library url
    When I set on '[data-cy="library_field_url"]' text 'notFound'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library_button_synchronize"]'

    Then I expect 'negative' toast to appear with text 'Error during library synchronization.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url can not be downloaded.'

    ## 503 Should display an error on duplicate library url
    When I set on '[data-cy="library_field_url"]' text 'alreadyExist'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library_button_synchronize"]'

    Then I expect 'negative' toast to appear with text 'Error during library synchronization.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url already exists.'

    ## 504 Should Synchronize library
    When I set on '[data-cy="library_field_url"]' text 'url_1'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library_button_synchronize"]'
    Then I expect 'positive' toast to appear with text 'Library is synchronized.'
