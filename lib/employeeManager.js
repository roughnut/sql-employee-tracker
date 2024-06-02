const pool = require("../config/connection");

async function viewAllDepts() {
  try {
    const { rows } = await pool.query(
      'SELECT id AS "Dept ID", name AS "Department" FROM department'
    );
    return rows;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

async function viewAllRoles() {
  try {
    const { rows } = await pool.query(
      `SELECT role.title AS "Job Title", role.id AS "Role ID", department.name AS "Department", role.salary AS "Salary" FROM role INNER JOIN department ON role.department_id = department.id`
    );
    return rows;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

async function viewAllEmployees() {
  try {
    const { rows } = await pool.query(
      `SELECT e.id AS "Employee ID", 
        e.first_name || ' ' || e.last_name AS "Employee Name",
        r.title AS "Job Title", r.salary AS "Salary", 
        m.first_name || ' ' || m.last_name AS "Manager Name"
        FROM employee e 
        INNER JOIN role r ON e.role_id = r.id
        LEFT JOIN employee m ON e.manager_id = m.id`
    );
    return rows;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

async function addDept(deptName) {
  try {
    const deptArr = [deptName];
    await pool.query(
      `INSERT INTO department(name)
            VALUES($1)`,
      deptArr
    );
    return;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}
async function addRole(roleName, roleSalary, roleDept) {
  try {
    const roleArr = [roleName, roleSalary, roleDept];
    await pool.query(
      `INSERT INTO role(title, salary, department_id)
            VALUES($1, $2, $3)`,
      roleArr
    );
    return;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

async function addEmployee(firstName, lastName, roleId, managerId) {
  try {
    const empArr = [firstName, lastName, roleId, managerId];
    await pool.query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES ($1, $2, $3, $4)`,
      empArr
    );
    return;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

async function updateEmployeeRole(empId, roleId) {
  const updateEmpArr = [empId, roleId];
  try {
    await pool.query(
      `UPDATE employee
            SET role_id = $2
            WHERE id = $1`,
      updateEmpArr
    );
    return;
  } catch (error) {
    console.error("Error: ", error.stack);
    throw error;
  }
}

module.exports = {
  viewAllDepts,
  viewAllRoles,
  viewAllEmployees,
  addDept,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
