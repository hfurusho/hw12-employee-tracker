const queries = require("./queries.js");
const inquirer = require("inquirer");

async function questions() {
  const employeeNames = (await queries.employees)
    .map(emp => `${emp.first_name} ${emp.last_name}`)
    .sort((a, b) => a > b);
  const roles = (await queries.roles)
    .map(role => role.title)
    .sort((a, b) => a > b);
  const departments = (await queries.departments)
    .map(dep => dep.name)
    .sort((a, b) => a > b);

  const action = {
    type: "rawlist",
    name: "action",
    message: "What would you like to do?",
    choices: ["View", "Add", "Update Employee Info."]
  };

  const viewAddCatagories = {
    type: "rawlist",
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
      type: "rawlist",
      name: "department",
      message: "Which department is the role a part of?",
      choices: departments
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
      type: "rawlist",
      name: "role",
      message: "What is the employee's role/position?",
      choices: roles
    },
    {
      type: "rawlist",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: employeeNames
    }
  ];

  const updateEmployee = [
    {
      type: "rawlist",
      name: "employee",
      message: "Please select an employee to update.",
      choices: employeeNames
    },
    {
      type: "rawlist",
      name: "catagory",
      message: "What would you like to update about the employee?",
      choices: ["Role", "Manager"]
    },
    {
      type: "rawlist",
      name: "newManager",
      message: "Who is the employee's new manager?",
      choices: employeeNames,
      when: function(answers) {
        return answers.catagory === "Manager";
      }
    },
    {
      type: "rawlist",
      name: "newRole",
      message: "What is the employee's new role?",
      choices: roles,
      when: function(answers) {
        return answers.catagory === "Role";
      }
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
    await inquirer.prompt(question.updateEmployee);
    // await inquirer.prompt(question.addEmployee);
  } catch (err) {
    console.log(err);
  }
}

init();
