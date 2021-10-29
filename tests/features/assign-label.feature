Feature: Assign a label via API

  Scenario: Assign a label to a meter and load it afterwards
    Given api with basic set of data
     When assigning a label
     Then label was assigned correctly