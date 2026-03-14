Feature: Task Management

  Scenario: User creates a task
    Given the user is logged in
    When the user creates a new task
    Then the task should appear in the dashboard