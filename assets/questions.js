const queries = require("./queries.js");
const inquirer = require("inquirer");

// module.exports.questions =
async function getQuestions() {
  const employeeNames = (await queries.employees())
    .map(emp => `${emp.first_name} ${emp.last_name}`)
    .sort((a, b) => sortAlpha(a, b))
    .concat(new inquirer.Separator());

  const roles = (await queries.roles())
    .map(role => role.title)
    .sort((a, b) => sortAlpha(a, b))
    .concat(new inquirer.Separator());
  const departments = (await queries.departments())
    .map(dep => dep.name)
    .sort((a, b) => sortAlpha(a, b))
    .concat(new inquirer.Separator());

  const action = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View", "Add", "Update Employee Info."]
    },
    {
      type: "list",
      name: "catagory",
      message: "Please select a catagory.",
      choices: ["Department(s)", "Role(s)", "Employee(s)"],
      when: function(answers) {
        return answers.action !== "Update Employee Info.";
      }
    }
  ];

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
      type: "list",
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
      type: "list",
      name: "role",
      message: "What is the employee's role/position?",
      choices: roles
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: ["None"].concat(employeeNames),
      filter: function(answer) {
        if (answer === "None") {
          return null;
        } else {
          return answer;
        }
      }
    }
  ];

  const updateEmployee = [
    {
      type: "list",
      name: "name",
      message: "Please select an employee to update.",
      choices: employeeNames
    },
    {
      type: "list",
      name: "catagory",
      message: "What would you like to update about the employee?",
      choices: ["Role", "Manager"]
    },
    {
      type: "list",
      name: "newManager",
      message: "Who is the employee's new manager?",
      choices: employeeNames,
      when: function(answers) {
        return answers.catagory === "Manager";
      }
    },
    {
      type: "list",
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
    addDep: addDep,
    addRole: addRole,
    addEmployee: addEmployee,
    updateEmployee: updateEmployee,
    employeeNames: employeeNames
  };
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

module.exports = { getQuestions };

// FOR TESTING
// async function init() {
//   try {
//     let question = await questions();
//     await inquirer.prompt(question.updateEmployee);
//     // await inquirer.prompt(question.addEmployee);
//   } catch (err) {
//     console.log(err);
//   }
// }

// init();
