'use strict';

var shortid = require('shortid');
var validator = require('validator');

var Url = require('../models/urls');
var path = process.cwd();

var MYURL = "https://shurli.herokuapp.com/";

module.exports = function (app) {


	app.route('/:id')
		.get(function (req, res) {
			// busca en la DB el id
			console.log(JSON.stringify(req.params));
			Url.findOne({code:req.params.id}, function(err, address){
			    if(err) { return handleError(res, err); }
			    if(!address) { 
			    	return res.status(404).json({"error":"No short url found for given input"}); 
			    }
				// redirect to the url
				//res.redirect(address.target);
				console.log(JSON.stringify(address));
				res.json(address);
			});
		});


	//var router = app.Router();
	app.route('/new/:url').get( function (req, res) {
			var allowInvalid = req.query.allow ?  req.query.allow.toUpperCase() === "TRUE": false;
			console.log("query>>",JSON.stringify(req.query));
			console.log("params>>>",JSON.stringify(req.params));
			// check url valid
			// if NOT valid &&    ?allow=false
			//           return res.json({"error":"URL invalid"});
			// save on whatever other case
			
			var validURL = validator.isURL(req.params.url) ;
			console.log("valid>>> ", validURL);
//			return res.json(req.params);

			if (!validURL && !allowInvalid) {
				return res.json({"error":"URL invalid"});
			}
			
			var data = {
				code: shortid.generate(),
				target: req.params.url,
				invalid: allowInvalid
			};
			console.log("data>>>>",JSON.stringify(data));
			
			Url.create(data, function(err, address) {
			    if(err) { return handleError(res, err); }
			    var result= {
			    	"original_url":address.target,
			    	"short_url":MYURL+ address.code
			    };
			    console.log("addr>>>",JSON.stringify(address));
			    
			    return res.status(201).json(result);
			  });
			
		});
	//app.use('/new', router);

};

function handleError(res, err) {
	console.log("error");
  return res.status(500).send(err);
}