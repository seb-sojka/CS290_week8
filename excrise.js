var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5454);
app.use(express.static('views'));

var exsql = require('./db.js');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

document.addEventListener('DOMContentLoaded', addButton);

app.get('/',function(req,res,next){
	var con = {};
    exsql.pool.query('SELECT name FROM exercises', function(err, rows, fields){
		con.excerises = JSON.stringify(rows);
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
		"weight INT,"+
		"date DATE,"+
		"lbs BOOLEAN)";
		exsql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render('home',context);
    })
  });
});

app.post('/add',function(req,res,next){
  var context = {};
  console.log("Got to post");
  exsql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.name], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
});

function addButton(){
	console.log("Button Pressed");
	document.getElementById('addButton').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var payload = {type:null, name:null, reps:null, weight:null, date:null, lbs:null};
		
		payload.name = document.getElementById("name").value || null;
		payload.reps = document.getElementById("reps").value || null;
		payload.weight = document.getElementById("weight").value || null;
		payload.date = document.getElementById("date").value || null;
		if(document.getElementById("lbs").value == lbs)
		{
			payload.lbs = 1;
		}else{
			payload.lbs = 0;
		}
		
		req.open('POST', 'http://httpbin.org/post', false);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response.json.string);
		  } else {
			console.log("Error in network request: " + req.statusText);
		  }});
		req.send(JSON.stringify(payload));
		event.preventDefault();
	});
}

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
