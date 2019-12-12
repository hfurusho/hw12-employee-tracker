const inquirer = require("inquirer");
const cTable = require("console.table");
const queries = require("./assets/queries.js");

// console.log(questions);

init();

async function init() {
  try {
    const questions = await require("./assets/questions").getQuestions();
    let answer = await inquirer.prompt(questions.action);
    if (answer.action === "Update Employee Info.") {
      const employee = await inquirer.prompt(questions.updateEmployee);
      console.log(employee);
    } else if (answer.action === "View") {
      let data;
      switch (answer.catagory) {
        case "Department(s)":
          data = (await queries.departments).sort((a, b) => a.name > b.name);
          break;
        case "Role(s)":
          data = (await queries.roles).sort((a, b) => a.title > b.title);
          break;
        case "Employee(s)":
          data = (await queries.employees).sort(
            (a, b) => a.first_name > b.first_name
          );
          break;
      }
      console.table(data);
    }
    return init();
  } catch (err) {
    throw new Error(err);
  }
}
