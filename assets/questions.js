const queries = require("./queries.js");
const inquirer = require("inquirer");

async function questions() {
  let employees = await queries.getEmployees();

  const action = {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View", "Add", "Update Employee Info."]
  };

  const viewAddCatagories = {
    type: "list",
    name: "catagory",
    message: "Please select a catagory.",
    choices: ["Department(s)", "Role(s)", "Employee(s)"]
  };

  const addDep = {
    type: "input",
    name: "name",
    message: "What is the name of the department?"
  };

  const addRole = [
    {
      type: "input",
      name: "title",
      message: "What is the title of the role?"
    },
    {
      type: "number",
      name: "salary",
      message: "What is the salary of the role?"
    },
    {
      type: "choice",
      name: "department",
      message: "Which department is the role a part of?",
      choices: [] //TODO getDepartments()
    }
  ];

  const addEmployee = [
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?"
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role/position?",
      choices: [] //TODO getRoles()
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: employees
    }
  ];

  const updateEmployee = [
    {
      type: "list",
      name: "employee",
      message: "Please select an employee to update.",
      choices: employees
    },
    {
      type: "list",
      name: "catagory",
      message: "What would you like to update about the employee?",
      choices: ["Role", "Manager"]
    }
  ];

  return {
    action: action,
    viewAddCatagories: viewAddCatagories,
    addDep: addDep,
    addRole: addRole,
    addEmployee: addEmployee,
    updateEmployee: updateEmployee
  };
}

async function init() {
  try {
    let question = await questions();
    inquirer.prompt(question.updateEmployee);
  } catch (err) {
    console.log(err);
  }
}

init();
