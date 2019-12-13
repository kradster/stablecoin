var mysql = require('mysql')
//var Sequelize = require("sequelize");


//Setting up the config
// sequelize = new Sequelize('colgateDemo', 'colgate', 'colgate', {
//   host: '18.222.97.182',
//   dialect: 'mysql',

//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

var con = mysql.createConnection({
  host: "18.222.97.182",    // ip address of server running mysql
  user: "colgate",    // user name to your mysql database
  password: "colgate",    // corresponding password
  database: "colgateDemo" // use the specified database
});



module.exports = con;

