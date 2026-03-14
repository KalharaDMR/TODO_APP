// Generated from: tests\feature\task.feature
import { test } from "playwright-bdd";

test.describe('Task Management', () => {

  test('User creates a task', async ({ Given, When, Then, page }) => { 
    await Given('the user is logged in', null, { page }); 
    await When('the user creates a new task', null, { page }); 
    await Then('the task should appear in the dashboard', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\feature\\task.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the user is logged in","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When the user creates a new task","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the task should appear in the dashboard","stepMatchArguments":[]}]},
]; // bdd-data-end