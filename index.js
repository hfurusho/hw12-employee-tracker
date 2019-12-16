const inquirer = require("inquirer");
const cTable = require("console.table");
const queries = require("./assets/queries.js");
const Questions = require("./assets/questions");

init();

async function init() {
  try {
    let questions = await Questions.getQuestions();
    let answer = await inquirer.prompt(questions.action);

    if (answer.action === "Update Employee Info.") {
      const employee = await inquirer.prompt(questions.updateEmployee);
      await queries.updateEmployee(
        employee.name,
        employee.catagory,
        employee.newManager || employee.newRole
      );
    } else if (answer.action === "View") {
      await viewData(answer);
    } else {
      await addNew(answer.catagory, questions);
    }
    return init();
  } catch (err) {
    throw new Error(err);
  }
}

async function viewData(answer) {
  let data;
  switch (answer.catagory) {
    case "Department(s)":
      data = (await queries.departments()).sort((a, b) =>
        sortAlpha(a.name, b.name)
      );
      break;
    case "Role(s)":
      data = (await queries.rolesTable()).sort((a, b) =>
        sortAlpha(a.title, b.title)
      );
      break;
    case "Employee(s)":
      data = (await queries.employeesTable()).sort((a, b) =>
        sortAlpha(a.first_name, b.first_name)
      );
      break;
  }
  console.table(data);
  return;
}

async function addNew(catagory, questions) {
  let data;
  switch (catagory) {
    case "Department(s)":
      data = await inquirer.prompt(questions.addDep);
      queries.addDepartment(data.name);
      break;
    case "Role(s)":
      data = await inquirer.prompt(questions.addRole);
      queries.addRole(data.title, data.salary, data.department);
      break;
    case "Employee(s)":
      data = await inquirer.prompt(questions.addEmployee);
      queries.addEmployee(
        data.firstName,
        data.lastName,
        data.role,
        data.manager
      );
      break;
  }
}

function sortAlpha(str1, str2) {
  str1 = str1.toUpperCase();
  str2 = str2.toUpperCase();
  if (str1 > str2) {
    return 1;
  } else if (str1 < str2) {
    return -1;
  } else {
    return 0;
  }
}
