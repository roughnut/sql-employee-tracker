const inquirer = require("inquirer");
const pool = require("../config/connection");
const {
  viewAllDepts,
  viewAllRoles,
  viewAllEmployees,
  addDept,
  addRole,
  addEmployee,
  updateEmployeeRole
} = require("./employeeManager");

async function empMgrPrompts() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "mgrOption",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit Employee Manager",
      ],
    },
  ]);

  const { mgrOption } = answers;

  switch (mgrOption) {
    case "View all departments":
      const departments = await viewAllDepts();
      console.table(departments);
      break;

    case "View all roles":
      const roles = await viewAllRoles();
      console.table(roles);
      break;

    case "View all employees":
      const employees = await viewAllEmployees();
      console.table(employees);
      break;

    case "Add a department":
      const { deptName } = await inquirer.prompt([
        {
          type: "input",
          message: "What is the name of the department?",
          name: "deptName",
        },
      ]);
      await addDept(deptName);
      console.log(`${deptName} added to database`);
      break;

    case "Add a role":
      const deptListObj = await pool.query(`SELECT id, name FROM department`);
      const deptListArr = deptListObj.rows.map((row) => row.name);
      const { roleName, roleSalary, roleDeptName } = await inquirer.prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName",
        },
        {
          type: "input",
          message: "What is the salary for the role?",
          name: "roleSalary",
          validate: function (salary) {
            const isNum = !isNaN(parseFloat(salary));
            return isNum || "Please enter a number";
          },
          filter: Number,
        },
        {
          type: "list",
          message: "What department does the role belong to?",
          name: "roleDeptName",
          choices: deptListArr,
        },
      ]);
      const roleDeptId = deptListObj.rows.filter(
        (row) => row.name === roleDeptName
      )[0].id;
      addRole(roleName, roleSalary, roleDeptId);
      console.log(`${roleName} added to database`);
      break;

    case "Add an employee":
      const roleListObj = await pool.query(`SELECT id, title FROM role`);
      const roleListArr = roleListObj.rows.map((row) => row.title);
      const empMgrObj = await pool.query(
        `SELECT id,
            first_name || ' ' || last_name AS full_name
            FROM employee`
      );
      const empMgrArr = empMgrObj.rows.map((row) => row.full_name);
      const { firstName, lastName, empRole, empMgr } = await inquirer.prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "empRole",
          choices: roleListArr,
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "empMgr",
          choices: empMgrArr,
        },
      ]);
      const empRoleId = roleListObj.rows.filter(
        (row) => row.title === empRole
      )[0].id;
      const empMgrId = empMgrObj.rows.filter(
        (row) => row.full_name === empMgr
      )[0].id;
      await addEmployee(firstName, lastName, empRoleId, empMgrId);
      break;

    case "Update an employee role":
      const updateEmpObj = await pool.query(
        `SELECT id,
            first_name || ' ' || last_name AS full_name
            FROM employee`
      );
      const updateEmpArr = updateEmpObj.rows.map((row) => row.full_name);
      const updateRoleObj = await pool.query(`SELECT id, title FROM role`);
      const updateRoleArr = updateRoleObj.rows.map((row) => row.title);
      const { empName, roleTitle } = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee do you wish to update?",
            name: "empName",
            choices: updateEmpArr
        },
        {
            type: "list",
            message: "What is the employee's new role?",
            name: "roleTitle",
            choices: updateRoleArr
        }
      ])
      const empId = updateEmpObj.rows.filter(row => row.full_name === empName)[0].id;
      const roleId = updateRoleObj.rows.filter(row => row.title === roleTitle)[0].id;
        await updateEmployeeRole(empId, roleId);
        console.log(`${empName} role updated to ${roleTitle}.`);
      break;

    case "Exit Employee Manager":
      console.log("See you next time!");
      process.exit();
      break;
  }
  empMgrPrompts();
}

module.exports = empMgrPrompts;
