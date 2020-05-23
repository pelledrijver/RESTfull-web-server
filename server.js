// ###############################################################################
//
// Database setup:
// First: Open sqlite database file, create if not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();
var router = express.Router();

//transforms json code into  body to req.body object property object
var bodyParser = require("body-parser");
app.use(bodyParser.json());

//allows cross-origin requests
var cors = require('cors')
app.use(cors());

// ###############################################################################
// Routes

router.get("/phones", function(req, res){
  db.all(`SELECT * FROM phones`, function(err, rows) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.status(200).json(rows);
    }
  });

    // TODO: add code that checks for errors so you know what went wrong if anything went wrong
    // TODO: set the appropriate HTTP response headers and HTTP response codes here.
});

//add get request for single phone with given id
router.get("/phones/id/:id", function(req, res){
  db.get(`SELECT * FROM phones WHERE id=` + req.params.id, function(err, row) {
    if (err) {
      res.status(400).send(err);
    }
    else if(row){
      res.status(200).json(row);
    }
    else{
        res.status(404).json({"Error": "Entry not found."});
    }
  });
});

router.post("/phones", function(req, res){
  if(isNaN(req.body.screensize)){
    res.status(400).send({"Error":"Enter a valid screensize"});
    return;
  }
  if(req.body.image === "" || req.body.brand === "" || req.body.model === "" || req.body.os === "" ||req.body.screensize === ""){
    res.status(400).send({"Error":"One or more of the passed string values are empty"});
    return;
  }
  db.run(`INSERT INTO phones (image, brand, model, os, screensize) VALUES (?, ?, ?, ?, ?)`,
         [req.body.image, req.body.brand, req.body.model, req.body.os, req.body.screensize],
         function(err) {
           if (err) {
             res.status(400).send(err);
           }
           else {
             res.status(201).json({'id': `${this.lastID}`});
           }
         });
});

router.put("/phones/id/:id", function(req, res){
  if(isNaN(req.body.screensize)){
    res.status(400).send({"Error":"Enter a valid screensize"});
    return;
  }

  if(req.body.image === "" || req.body.brand === "" || req.body.model === "" || req.body.os === "" ||req.body.screensize === ""){
    res.status(400).send({"Error":"One or more of the passed string values are empty"});
    return;
  }
  db.run(`UPDATE phones SET image=?, brand=?, model=?, os=?, screensize=? WHERE id=?`,
         [req.body.image, req.body.brand, req.body.model, req.body.os, req.body.screensize, req.params.id],
         function(err){
           if (err) {
             res.status(400).send(err);
           }
           else if(!this.changes){
             res.status(404).json({"Error": "Entry not found."});
           }
           else {
             res.status(204).send();
           }
         });
});

router.delete("/phones/id/:id", function(req, res){
  db.run("DELETE FROM phones WHERE id=" + req.params.id, function(err){
    if (err) {
      res.status(400).send(err);
    }
    else if(!this.changes){
      res.status(404).json({"Error": "Entry not found."});
    }
    else {
      res.status(204).send();
    }
  });
});

router.delete("/phones/reset", function(req, res){
  db.run("DELETE FROM phones", function(err){
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.status(204).send();
    }
  });
});

app.use("/api", router);

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:
app.listen(3000);

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
        db.run(`INSERT INTO phones (image, brand, model, os, screensize) VALUES (?, ?, ?, ?, ?)`,
        ["https://fra1.digitaloceanspaces.com/cdn-armor3/armor3/product_images/2019/12/20/iphone_11_paars.png", "Apple", "iPhone 11", "IOS", "6"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
