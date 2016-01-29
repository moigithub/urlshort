'use strict';

var shortid = require('shortid');
var validator = require('validator');

var Url = require('../models/urls');
var path = process.cwd();

var MYURL = process.env.HOST || "https://smalluri.herokuapp.com/";

module.exports = function (app) {


	app.route('/:id')
		.get(function (req, res) {
			// busca en la DB el id
			//console.log(JSON.stringify(req.params));
			Url.findOne({code:req.params.id}, function(err, address){
			    if(err) { return handleError(res, err); }
			    if(!address) { 
			    	return res.status(404).json({"error":"No short url found for given input"}); 
			    }
				// redirect to the url
				//console.log(address.target);
// relative url??
// if not protocol found, add http:// as default
				var target = (address.target.search("://") >=0) ? address.target : "http://"+address.target;
				res.redirect(target);
				//console.log(JSON.stringify(address));
				//res.json(address);
			});
		});


	//var router = app.Router();
	app.route('/new/*').get(function (req, res) {
			var allowInvalid = req.query.allow ?  req.query.allow.toUpperCase() === "TRUE": false;
			//console.log("query>>",JSON.stringify(req.query));
			//console.log("params>>>",JSON.stringify(req.params));
			// check url valid
			// if NOT valid &&    ?allow=false
			//           return res.json({"error":"URL invalid"});
			// save on whatever other case
			
			var options =  { 
				protocols: ['http','https','ftp'], 
				require_tld: true, require_protocol: false, 
				require_valid_protocol: true, allow_underscores: false, 
				host_whitelist: false, host_blacklist: false, 
				allow_trailing_dot: false, allow_protocol_relative_urls: true 
			};
			var validURL = validator.isURL(req.params["0"], options) ;
			//console.log("valid>>> ", validURL);
//			return res.json(req.params);

			if (!validURL && !allowInvalid) {
				return res.json({"error":"URL invalid"});
			}
			
			var data = {
				code: shortid.generate(),
				target: req.params["0"],
				invalid: allowInvalid
			};
			//console.log("data>>>>",JSON.stringify(data));
			
			Url.create(data, function(err, address) {
			    if(err) { return handleError(res, err); }
			    var result= {
			    	"original_url":address.target,
			    	"short_url":MYURL+ address.code
			    };
			    //console.log("addr>>>",JSON.stringify(address));
			    
			    return res.status(201).json(result);
			  });
			
		});
	//app.use('/new', router);

};

function handleError(res, err) {
//	console.log("error");
  return res.status(500).send(err);
}