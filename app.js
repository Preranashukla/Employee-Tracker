const inquirer = require("inquirer");
//const seed = require(./db/seed.sql);

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // {TODO: Add your MySQL password}
    password: 'Pass@123',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);

// Query database

function finalDisplay(){
  inquirer.prompt([{
    type: 'list',
    name: 'prompts',
    message: "What would you like to do?",
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
}])
.then(function(data) {
  switch (data.prompts) {
      case 'View all Departments':
      viewAllDepartments();
      break;

      case 'View all Roles':
      viewAllRoles();
      break;

      case 'View all Employees':
      viewAllEmployees();
      break;

      case 'Add Department':
      addDepartment();
      break;

      case 'Add Role':
      addRole();
      break;

      case 'Add Employee':
      addEmployee();
      break;

      case 'Update Employee Role':
      updateEmployee();
      break;

      case 'Quit' :
      quit();
      break;

  }})
};


function viewAllDepartments(){
  db.query('SELECT * FROM department', function(err, res) {
    if (err) throw err
    console.table(res)
    finalDisplay();
} )
};

function viewAllRoles(){
  db.query('SELECT * FROM employee_role', function(err, res) {
    if (err) throw err
    console.table(res)
    finalDisplay();
} )
};

function viewAllEmployees(){
  db.query('SELECT * FROM employee', function(err, res) {
    if (err) throw err
    console.table(res)
    finalDisplay();
} )
};


function addEmployee(){
  inquirer.prompts([{
    type: 'input',
    message: 'What is employees first name?',
    name: 'firstName'
  },
  { 
    type: 'input',
    message: 'What is employees last name?',
    name: 'lastName'
  },
  {
    type: 'input',
    message: 'What is employees role id?',
    name: 'roleId'
  },
  {
    type: 'input',
    message: 'What is employees manager id?',
    name: 'managerId'
  }
]).then((answers)=>{
  db.query(`INSERT INTO employee SET ?`,
  {
    first_name: answers.firstName,
    last_name: answers.lastName,
    role_id: answers.roleId,
    manager_id: answers.managerId
  },
  (err) => {
    if (err) throw err;
    console.log('Added employee')
    console.table(answers)
    finalDisplay()

  })
})
};

function addDepartment(){
  return inquirer
  .prompt([{
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department?',
      validate: function(name) {
          if (!name) {
              console.log('You must enter department name!')
              return false;
          }
          return true;
      }
  }])  
  .then((answer) => {
    db.query(`INSERT INTO department SET ?`,
    {
      department_name: answer.name
    },
    (err) => {
      if (err) throw err;
      console.log('Added new Department')
      console.table(answer)
      finalDisplay()
    })
  })
};

function addRole(){
  inquirer.prompt(
    [
        {
            type: 'input',
            name: 'addRole',
            message: 'What role would you like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'input',
            name: 'departid',
            message: 'What is the department code?'
        }])
        .then((answer)=> {
          db.query(`INSERT INTO employee_role SET ?`,
          {
            title: answer.addRole,
            salary: answer.salary,
            department_id : answer.departid
          },
          (err) => {
            if (err) throw err;
            console.log('Added new Role')
            console.table(answer)
            finalDisplay();
          })
        })
    
        
}

let empArr = emp();
let roleArr = role();
function emp(){
const employeesArray = [];
   const empQuery = 'SELECT * FROM employee';
    db.query(empQuery, (err, res) => {
        if (err) throw err;
        res.forEach(({first_name}) => {
            employeesArray.push(first_name);
        });
    });

    return employeesArray;
  }

  function role(){
    const rolesArray = [];
    const roleQuery = `SELECT title FROM employee_role`
    db.query(roleQuery, (err, res) => {
      if (err) throw err;
      res.forEach(({title}) => {
        rolesArray.push(title);
 });
 });

 return rolesArray;
}

function updateEmployee(){
  inquirer.prompt([
    {
      type: 'list',
      message: 'Which employee would you like to update?',
      choices: empArr,
      name: 'roleUpdate'
    },
    {
      type: 'list',
      message: 'What would you like for the new role',
      choices: roleArr,
      name: 'newRole'
    }
  ]).then((answers)=>{
    db.query(`UPDATE employee_role SET title = ? WHERE first_name = ?`,
    {
      title: answers.newRole,
      first_name: answers.roleUpdate
    },
    (err) => {
     if (err) throw err;
     console.log('Updated Employee Role')
     console.table(answers)
     finalDisplay()
    })
   
  })

};

finalDisplay();

function quit(){
  console.log ("Thank you for using this app good bye");
  return
}


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});
