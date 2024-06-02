const { Pool } = require('pg');

// connect to db
const pool = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    database: 'company_db'
},
    console.log('Connected to company_db')
);

module.exports = pool;