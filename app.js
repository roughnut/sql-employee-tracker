// get express server
const server = require('./config/server');

// get splash screen module
const splashText = require("./lib/splash");

// import Inquirer function from module
const empMgrPrompts = require('./lib/inquirer');

// app splash title
console.log(splashText);

server.then(empMgrPrompts);