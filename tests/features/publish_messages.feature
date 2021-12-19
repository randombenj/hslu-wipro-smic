Feature: Measurement Data Publishing to SMIC

  Scenario: Publish some measuring data
    Given an electricity meter
    And the database is empty
    When we publish some measuring data
    Then the data is available via the api

  Scenario: Use TLS to secure connection
    Given the mqtt endpoint is running
    When we check for tls encryption
    Then the correct certificate is used