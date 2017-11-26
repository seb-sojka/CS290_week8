var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.eecs.oregonstate.edu',
  user            : 'cs290_sojkas',
  password        : '3468',
  database        : 'cs290_sojkas'
});

module.exports.pool = pool;
