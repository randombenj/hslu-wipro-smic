Feature: Metering data Publishing to SMIC

  Scenario: Publish some measuring data
    Given a smart meter client
     When we publish some measuring data
     Then the data is available via the api