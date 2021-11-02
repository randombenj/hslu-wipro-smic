Feature: Measurement Data Publishing to SMIC

  Scenario: Publish some measuring data
    Given an electricity meter
    And the database is empty
    When we publish some measuring data
    Then the data is available via the api