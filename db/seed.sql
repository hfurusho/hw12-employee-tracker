USE employeesDB;

INSERT INTO department (name)
VALUES ("Engineering"), ("Finance"), ("Legal"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES
("Software Engineer", 95000, 1),
("Lead Engineer", 115000, 1),
("QA Test Engineer", 60000, 1),
("Accountant", 110000, 2),
("Attorney", 125000, 3),
("Paralegal", 70000, 3),
("Legal Assistant", 55000, 3),
("Sales Lead", 95000, 4),
("Salesperson", 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Ernest", "Pitt", 2, 2),
("Deon", "Pace", 1, null),
("Cloe", "Hall", 3, 2),
("Trinity", "Clifford", 1, 2),
("Addison", "Peralta", 5, null),
("Fateh", "Joseph", 6, 5),
("Eoghan", "Crouch", 9, 8),
("Benito", "Morgan", 8, null),
("Kairon", "Wagstaff", 1, 2),
("Monet", "O'Moore", 9, 8);
