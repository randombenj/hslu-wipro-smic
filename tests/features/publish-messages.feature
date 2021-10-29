Feature: Measurement Dasta Publishing to SMIC

  Scenario: Publish some measurement data
    Given a smart meter client
     When we publish measurement data
     Then the data is available via the api