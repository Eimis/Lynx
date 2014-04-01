Feature: Date field tests
    Functional tests for the editlive Date field

    Scenario: Date Initial state
        Given I'm TestMan
        Given I open the date test page
        Then I see "input#id_date_test[name='date_test'][type='text']"
        Then I see a "dateField" editlive for "#id_date_test"
        Then I see "#id_date_test" is hidden
        Then I see a visible placeholder for "#id_date_test"

    Scenario: Date Edit mode
        Given I'm TestMan
        Given I open the date test page
        When I click on the placeholder for "#id_date_test"
        Then I see "#id_date_test" is visible

    Scenario: Date Edit and save
        Given I'm TestMan
        Given I open the date test page
        When I click on the placeholder for "#id_date_test"
        Then I see "#id_date_test" is visible
        When I input "2013-01-01" in "#id_date_test"
        Then the value of "#id_date_test" is "2013-01-01"
        Then I see "#id_date_test" is hidden
        Then I see a visible placeholder for "#id_date_test"

    Scenario: Date validation
        Given I'm TestMan
        Given I open the date test page
        When I click on the placeholder for "#id_date_test"
        When I input "2013-99-99" in "#id_date_test"
        Then I see the following error: Enter a valid date.
        When I click on "h1"
        Then I see a hidden placeholder for "#id_date_test"
        Then I see "#id_date_test" is visible

    Scenario: Date with template filters
        Given I'm TestMan
        Given I open the date test page with options "?template_filters=date:'M d, Y'"
        Then the value of the placeholder for "#id_date_test" is "Jan 01, 2013"
        When I click on the placeholder for "#id_date_test"
        When I input "2013-05-01" in "#id_date_test"
        Then the value of the placeholder for "#id_date_test" is "May 01, 2013"

    Scenario: Anonymous mode
        Given I open the char test page
        Then I don't see ".editlive"
