document.addEventListener('DOMContentLoaded', addButton);

function addButton(){
	document.getElementById('add').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		
		var payload = {type:null, name:null, reps:null, weight:null, date:null, lbs:null};
		payload.type = 'add';
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
		var insertValues = "'"+ payload.name+ "', " + payload.reps + ", " + payload.weight + ", '" +
			payload.date + "', " + payload.lbs;
		var insert = "INSERT INTO todo (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (" + insertValues + ")";
		console.log(insert);
		mysql.pool.query(insert, function(err, result){
			if(err){
				next(err);
				return;
			}
		});
		var con = {};
		exsql.pool.query('SELECT name FROM exercises', function(err, rows, fields){
			con.excerises = JSON.stringify(rows);
			res.render('home',con);
		});
	});
}