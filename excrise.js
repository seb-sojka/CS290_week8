var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5454);
app.use(express.static('views'));

var exsql = require('./db.js');

app.get('/',function(req,res,next){
	var con = {};
	exsql.pool.query('SELECT * FROM exercises', function(err, rows, fields){
		console.log(rows);
		con.exc = rows;
		res.render('home',con);
	});
});	
		
app.get('/reset-table',function(req,res,next){
	var context = {};
	exsql.pool.query("DROP TABLE IF EXISTS exercises", function(err){
		var createString = "CREATE TABLE exercises("+
		"id INT PRIMARY KEY AUTO_INCREMENT,"+
		"name VARCHAR(255) NOT NULL,"+
		"reps INT,"+
		"weight VARCHAR(255),"+
		"date DATE,"+
		"lbs BOOLEAN)";
		exsql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render('home',context);
    })
  });
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/del',function(req,res, next){
	exsql.pool.query("DELETE FROM exercises WHERE `id` = (?)", 
	[req.body.id], function(err, result){
    if(err){
		console.log("Error");

		next(err);
		return;
    }
	exsql.pool.query('SELECT * FROM exercises', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		console.log(rows);
		console.log("*********************************");

		res.send(JSON.stringify(rows))});
	});
});
 

app.post('/add',function(req,res, next){
  exsql.pool.query("INSERT INTO exercises (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ? ,? ,?)", 
	[req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
		console.log("Error");
		next(err);
		return;
	}
		console.log("Inserted id" + result.insertId);
		exsql.pool.query('SELECT * FROM exercises', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		console.log(rows);
		console.log("*********************************");

		res.send(JSON.stringify(rows))});
	});
});

app.get('/edit', function(req,res, next){
	exsql.pool.query('SELECT * FROM exercises WHERE `id` = (?)',[req.query.id], function(err, rows, fields){
	if(err){
		next(err);
		return;
	}
	console.log(rows);
	console.log("*********************************");
	res.send(JSON.stringify(rows))});
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
