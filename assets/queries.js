const mysql = require("mysql");
require("dotenv").config({ path: "./.env" });

/******************************************/
/*     Connection and Query Functions     */
/******************************************/

// Creates and returns connection to employeesdb.
function makeConnection() {
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employeesdb"
  });
  connection.connect(err => {
    if (err) throw err;
  });
  return connection;
}

// Queries the DB and returns the results from the database.
function queryDB(query) {
  let connection = makeConnection();
  return new Promise((resolve, reject) => {
    connection.query(query, function(err, res) {
      if (err) throw err;
      connection.end();
      resolve(res);
    });
  });
}

// Updates the DB and does not return anything.
function updateDB(query) {
  let connection = makeConnection();
  connection.query(query, function(err, res) {
    if (err) throw err;
    connection.end();
  });
}

/******************************************/
/*         Adding To DB Functions         */
/******************************************/

// Adds a department to the DB.
async function addDepartment(name) {
  const query = `
  INSERT INTO department (name)
  VALUES ("${name}")`;
  updateDB(query);
}

// Adds a role to the DB.
async function addRole(title, salary, department) {
  const depId = await getDepartmentId(department);
  const query = `
  INSERT INTO role (title, salary, department_id)
  VALUES ("${title}", ${salary}, ${depId})`;
  updateDB(query);
}

// Adds an employee to the DB.
async function addEmployee(firstName, lastName, role, manager) {
  const roleId = await getRoleId(role);
  let managerId;
  if (manager) {
    const managerNameArr = manager.split(" ");
    managerId = await getEmployeeId(managerNameArr[0], managerNameArr[1]);
  } else {
    managerId = null;
  }
  const query = `
  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId})`;
  updateDB(query);
}

/******************************************/
/*        Update DB Entry Functions       */
/******************************************/

// Updates an employee's role or manager
async function updateEmployee(name, catagory, newVal) {
  const nameArr = name.split(" ");
  const empId = await getEmployeeId(nameArr[0], nameArr[1]);
  let newValId;

  if (catagory === "Role") {
    newValId = await getRoleId(newVal);
    catagory = "role_id";
  } else {
    newValId = await getDepartmentId(newVal);
    catagory = "department_id";
  }

  const query = `
    UPDATE employee
    SET ${catagory}="${newValId}"
    WHERE id="${empId}"`;
  updateDB(query);
}

/******************************************/
/*        Read DB Table Functions         */
/******************************************/

// Reads and returns the employee table.
function getEmployees() {
  const query = "SELECT * FROM employee";
  return queryDB(query);
}

// Reads and returns the role table.
function getRoles() {
  const query = "SELECT * FROM role";
  return queryDB(query);
}

// Reads and returns the department table.
function getDepartments() {
  const query = "SELECT * FROM department";
  return queryDB(query);
}

// Reads and returns the full employees table where foreign keys display names/titles instead.
function getFullEmployeesTable() {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role, 
    CONCAT(m.first_name, " ", m.last_name) AS manager 
    FROM employee AS e
    JOIN role AS r
    ON e.role_id = r.id
    JOIN employee AS m
    ON e.manager_id = m.id`;
  return queryDB(query);
}

// Reads and returns the full roles table where department_id shows the department name instead.
function getFullRolesTable() {
  const query = `
    SELECT r.id, r.title, r.salary, d.name AS department 
    FROM role AS r
    JOIN department AS d ON r.department_id = d.id;`;
  return queryDB(query);
}

// Queries the DB and returns the employee's ID based off first and last name.
async function getEmployeeId(firstName, lastName) {
  const employees = await getEmployees();
  for (let i = 0; i < employees.length; i++) {
    if (
      employees[i].first_name === firstName &&
      employees[i].last_name === lastName
    ) {
      return employees[i].id;
    }
  }
}

// Queries the DB and returns the role's ID based off role title.
async function getRoleId(role) {
  const roles = await getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].title === role) {
      return roles[i].id;
    }
  }
}

// Queries the DB and returns the department's ID based off department name.
async function getDepartmentId(dep) {
  const departments = await getDepartments();
  for (let i = 0; i < departments.length; i++) {
    if (departments[i].name === dep) {
      return departments[i].id;
    }
  }
}

// Queries the DB and returns the department's ID based off the role title.
async function getDepartmentIdByRole(role) {
  const roles = await getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].title === role) {
      return roles[i].department_id;
    }
  }
}

module.exports = {
  employees: getEmployees,
  departments: getDepartments,
  roles: getRoles,
  updateEmployee: updateEmployee,
  addEmployee: addEmployee,
  addDepartment: addDepartment,
  addRole: addRole,
  employeesTable: getFullEmployeesTable,
  rolesTable: getFullRolesTable
};
