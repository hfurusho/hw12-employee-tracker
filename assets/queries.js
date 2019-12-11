const mysql = require("mysql");
require("dotenv").config({ path: "../.env" });

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

// function getEmployees() {
//   let connection = makeConnection();

//   return new Promise((resolve, reject) => {
//     connection.query("SELECT * FROM employee", function(err, res) {
//       if (err) throw err;
//       let employees = [];
//       for (let i = 0; i < res.length; i++) {
//         const fullName = res[i].first_name + " " + res[i].last_name;
//         employees.push(fullName);
//       }
//       employees.sort((a, b) => a > b);
//       connection.end();
//       resolve(employees);
//     });
//   });
// }

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

(async function init() {
  let roles = await getRoles();
  let employees = await getEmployees();
  let departments = await getDepartments();
  // console.log(roles[5].title);
  // console.log(employees);
  console.log(departments);
})();

module.exports = {
  employees: getEmployees(),
  departments: getDepartments(),
  roles: getRoles()
};

// getEmployees();

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
