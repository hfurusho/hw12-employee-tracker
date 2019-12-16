const mysql = require("mysql");
require("dotenv").config({ path: "./.env" });

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

function updateDB(query) {
  let connection = makeConnection();
  connection.query(query, function(err, res) {
    if (err) throw err;
    connection.end();
  });
}

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
  WHERE id="${empId}"
  `;
  updateDB(query);
}

function getEmployees() {
  const query = "SELECT * FROM employee";
  return queryDB(query);
}

function getRoles() {
  const query = "SELECT * FROM role";
  return queryDB(query);
}

function getDepartments() {
  const query = "SELECT * FROM department";
  return queryDB(query);
}

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

async function getRoleId(role) {
  const roles = await getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].title === role) {
      return roles[i].id;
    }
  }
}

async function getDepartmentId(dep) {
  const departments = await getDepartments();
  for (let i = 0; i < departments.length; i++) {
    if (departments[i].name === dep) {
      return departments[i].id;
    }
  }
}

async function getDepartmentIdByRole(role) {
  const roles = await getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].title === role) {
      return roles[i].department_id;
    }
  }
}

// FOR TESTING
// (async function init() {
//   console.log(await getDepartmentId("Finance"));
// })();

module.exports = {
  employees: getEmployees,
  departments: getDepartments,
  roles: getRoles,
  updateEmployee: updateEmployee,
  addEmployee: addEmployee
};

// function updateProduct() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function deleteProduct() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }

// function readProducts() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }
