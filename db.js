var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'mysql.eecs.oregonstate.edu',
  user            : 'sojkas',
  password        : '3468',
  database        : 'sojkas'
});

module.exports.pool = pool;
