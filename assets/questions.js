const actionQ = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View", "Add", "Update"]
  },
  {
    type: "list",
    name: "catagory",
    message: "Please select a catagory.",
    choices: ["Department(s)", "Role(s)", "Employee(s)"]
  }
];

const addDepQ = {
  type: "input",
  name: "name",
  message: "What is the name of the department?"
};

const addRoleQ = [
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

const addEmployeeQ = [
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
    choices: [] //TODO getEmployees()
  }
];
/*
  {
    type: ,
    name: ,
    message:
  }
}
*/
