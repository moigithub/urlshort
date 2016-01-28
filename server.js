'use strict';

//https://github.com/dylang/shortid
/*
var shortid = require('shortid');

console.log(shortid.generate());

-*-*-
Mongoose Unique Id

_id: {
    type: String,
    unique: true,
    'default': shortid.generate
}
*/
//https://www.npmjs.com/package/validator  isURL(str [, options]) 


// redirect
/*
response.writeHead(302, {Location: encodeURI(url)}); response.end();
-o-
 res.redirect('http://app.example.io');
*/
var express = require('express');
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');


var app = express();
require('dotenv').load();


mongoose.connect(process.env.MONGO_URI);

app.use('/', express.static(process.cwd() + '/public'));


routes(app);

var port = process.env.PORT || 8080;
var host = process.env.HOST  || "https://urlshort-moisesman.c9users.io/";
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...'+ host);
});