DO $$

DECLARE

BEGIN

-- Seed departments
INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), ('Finance'), ('Human Resources');

-- Seed roles
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 60000, 1), ('Marketing Specialist', 50000, 2),
    ('Financial Analyst', 55000, 3), ('HR Coordinator', 45000, 4);

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, NULL), 
    ('Jane', 'Smith', 2, 1),
    ('Mike', 'Johnson', 3, 1),
    ('Sarah', 'Williams', 4, 2),
    ('David', 'Brown', 1, 3),
    ('Emily', 'Davis', 2, 3),
    ('Michael', 'Wilson', 3, 4),
    ('Jessica', 'Taylor', 4, 4),
    ('Daniel', 'Anderson', 1, 5),
    ('Olivia', 'Thomas', 2, 5);

RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;

END $$;