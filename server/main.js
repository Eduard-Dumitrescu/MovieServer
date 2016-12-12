"use strict";
let sqlite3 = require('sqlite3').verbose();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

//check for user in database
app.post('/login', function (req, res) 
{
   let db = new sqlite3.Database('MovieDB.db');

   let query = "SELECT * FROM Users WHERE Username=\"" + req.body.Username + "\"" + " AND Password=\"" + req.body.Password + "\"";
   db.all(query,function(err,rows){
      let obj  = new Object();
      if(rows.length == 1)
      {
           console.log("User " + req.body.Username + " just logged in");
           obj.data = true;
           obj.UserId = rows[0].Id;
      }
      else 
      {
           console.log("User " + req.body.Username + " just logged in");
           obj.data = false;
      }
      res.send(JSON.stringify(obj));
   });
   db.close();
});


//get all movies by user id
app.post('/movies', function (req, res) 
{
   console.log("Get movies for user with id : " + req.body.UserId);
   let db = new sqlite3.Database('MovieDB.db');

   let query = "SELECT * FROM Movies WHERE UserId=" + req.body.UserId;
   db.all(query,function(err,rows){
      res.send(JSON.stringify(rows));
   });
   db.close();

});

//add movie to database
app.post('/addMovie', function (req, res) 
{
   let db = new sqlite3.Database('MovieDB.db');

   let query = "INSERT INTO Movies(Name,Rating,UserId) VALUES (\"" + req.body.Name + "\"," + req.body.Rating + "," + req.body.UserId + ")" ;
   db.run(query,[],function(callback) {
       let obj = new Object();
       if(callback == null)
       {
            console.log("Added movie " + req.body.Name + " for user with id : " + req.body.UserId);
            obj.data = "success";
       }
       else
       {
            console.log("Failed to add movie " + req.body.Name + " for user with id : " + req.body.UserId);
            obj.data = callback;
       }
       res.send(JSON.stringify(obj));
   });
   db.close();

});

//update movie by id
app.post('/updateMovie', function (req, res) 
{
   let db = new sqlite3.Database('MovieDB.db');

   let query = "UPDATE Movies SET Name=\"" + req.body.Name + "\",Rating=" + req.body.Rating + " WHERE Id=" + req.body.Id;
   db.run(query,[],function(callback) {
       let obj = new Object();
       if(callback == null)
       {
           console.log("Update movie with id : " + req.body.Id);
            obj.data = "success";
       }
       else
       {
           console.log("Failed to update movie with id : " + req.body.Id);
           obj.data = callback;
       }
       res.send(JSON.stringify(obj));
   });
   db.close();

});

//delete movie by id
app.post('/deleteMovie', function (req, res) 
{
   let db = new sqlite3.Database('MovieDB.db');

   let query = "DELETE FROM Movies WHERE Id=" + req.body.MovieId;
   db.run(query,[],function(callback) {
       let obj = new Object();
       if(callback == null)
       {
            console.log("Deleted movie with id : " + req.body.Id);
             obj.data = "success";
       }
       else
       {
            console.log("Failed to delete movie with id : " + req.body.Id);
            obj.data = callback;
       }
       res.send(JSON.stringify(obj));
   });
   db.close();

});

var server = app.listen(8081, function () {

   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});