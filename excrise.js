var express = require('express');


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5454);
app.use(express.static('views'));

var exsql = require('./dbcon.js');

app.get('/',function(req,res,next){
	var con = {};
	exsql.pool.query('INSERT INTO exercises(`name`, `reps`) VALUES ("Test", 1)', function(err){
	    exsql.pool.query('SELECT name FROM exercises', function(err, rows, fields){
		  con.excerises = JSON.stringify(rows);
		  res.render('home',con);
		});
	  });
	});

app.get('/reset-table',function(req,res,next){
	var context = {};
	exsql.pool.query("DROP TABLE IF EXISTS exercises", function(err){
		var createString = "CREATE TABLE exercises("+
		"id INT PRIMARY KEY AUTO_INCREMENT,"+
		"name VARCHAR(255) NOT NULL,"+
		"reps INT,"+
		"weight INT,"+
		"date DATE,"+
		"lbs BOOLEAN)";
		exsql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Website Located at http://flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
