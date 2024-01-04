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
  ## 403 Should display an error on empty library role name and url
  ## 404 Should display an error on duplicate library url
  ## 405 Should display an error on duplicate library role name
  ## 406 Should display an error on not found library url
  ## 407 Should create library and go to its page

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
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_1_button_show"]' exists
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_1_button_remove"]' exists
    And I expect '[data-cy="libraries_table"] tbody tr:nth-child(2) td.library-name' is 'lib2'
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_2_button_show"]' exists
    And I expect '[data-cy="libraries_table"] [data-cy="library_id_2_button_remove"]' exists

    ####################################################
    ################## Select library ##################
    ####################################################

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

    ####################################################
    ################## Delete library ##################
    ####################################################

    ## 301 Should delete selected library
    When I click on '[data-cy="library_id_2_button_remove"]'
    Then I expect '[data-cy="button_confirm"]' exists

    When I click on '[data-cy="button_confirm"]'
    Then I expect 'positive' toast to appear with text 'Library is removed.'
    And  I expect '[data-cy="libraries_table"] tbody tr' appear 1 time on screen
    And  I expect '[data-cy="libraries_table"] tbody tr:nth-child(1) td.library-name' is 'lib1'
    And  I expect '[data-cy="libraries_table"] [data-cy="library_id_1_button_show"]' exists
    And  I expect '[data-cy="libraries_table"] [data-cy="library_id_1_button_remove"]' exists

    ####################################################
    ################## Add library    ##################
    ####################################################

    ## 401 Should redirect to AddLibrary page
    When I click on '[data-cy="libraries_button_add"]'
    Then I expect current url is '/add-library'

    ## 402 Should redirect to libraries page on cancel
    When I force click on '[data-cy="library-button-cancel"]'
    Then I expect current url is '/libraries'

    ## 403 Should display an error on empty library role name and url
    When I click on '[data-cy="libraries_button_add"]'
    And  I click on '[data-cy="library-button-add"]'
    Then I expect '.library-field-roleName div[role="alert"]' is 'Field is required'

    When I set on '[data-cy="library-field-roleName"]' text 'role'
    And  I click on '[data-cy="library-button-add"]'
    Then I expect '.library-field-roleName div[role="alert"]' not exists
    And  I expect '.library-field-url div[role="alert"]' is 'Field is required'

    ## 404 Should display an error on duplicate library url
    When I set on '[data-cy="library-field-url"]' text 'alreadyExist'
    And  I set on '[data-cy="library-field-roleName"]' text 'role'
    And  I click on '[data-cy="library-button-add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url already exists.'

    ## 405 Should display an error on not found library url
    When I set on '[data-cy="library-field-url"]' text 'notFound'
    And  I click on '[data-cy="library-button-add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-roleName div[role="alert"]' not exists
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url can not be downloaded.'

    ## 406 Should display an error on duplicate library role name
    When I set on '[data-cy="library-field-url"]' text 'valid'
    And  I set on '[data-cy="library-field-roleName"]' text 'alreadyExist'
    And  I click on '[data-cy="library-button-add"]'

    Then I expect 'negative' toast to appear with text 'Error during library creation.'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I expect '.library-field-roleName div[role="alert"]' is 'Library with this roleName already exists.'

    ## 407 Should create library and go to its page
    When I set on '[data-cy="library-field-url"]' text 'valid'
    And  I set on '[data-cy="library-field-roleName"]' text 'valid'
    And  I click on '[data-cy="library-button-add"]'

    Then I expect current url is '/libraries/id_1'
    And  I expect 'positive' toast to appear with text 'Library is created.'
    And  I expect field '[data-cy="library-field-url"]' is 'url_1'

    ####################################################
    ################## Add library    ##################
    ####################################################

    ## 501 Should display an error on empty library url
    When I set on '[data-cy="library-field-url"]' text ''
    Then I expect '.library-field-url div[role="alert"]' is 'Field is required'

    ## 502 Should display an error on not found library url
    When I set on '[data-cy="library-field-url"]' text 'notFound'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library-button-synchronize"]'

    Then I expect 'negative' toast to appear with text 'Error during library synchronization.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url can not be downloaded.'

    ## 503 Should display an error on duplicate library url
    When I set on '[data-cy="library-field-url"]' text 'alreadyExist'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library-button-synchronize"]'

    Then I expect 'negative' toast to appear with text 'Error during library synchronization.'
    And  I expect '.library-field-url div[role="alert"]' is 'Library with this url already exists.'

    ## 504 Should Synchronize library
    When I set on '[data-cy="library-field-url"]' text 'url_1'
    And  I expect '.library-field-url div[role="alert"]' not exists
    And  I click on '[data-cy="library-button-synchronize"]'

    Then  I expect 'positive' toast to appear with text 'Library is synchronized.'
