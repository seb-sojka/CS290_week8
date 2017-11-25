var mysql = require('mysql');
var exPool = mysql.createPool({
	connectionLimit	: 5,
	host			: 'localhost',
	user  			: 'student',
	password		: 'default',
	database		: 'student'
});

module.exports.pool = exPool;