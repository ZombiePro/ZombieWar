/**
 * Created by gerardooscarjt on 11/02/2014
*/

'use strict';

var	winston = require("winston"),
	path = require('path'),
	fs = require('fs');

var base_dir = path.dirname(module.filename) + path.sep;

function serveFile(filename, content_type, res) {

	filename = base_dir + filename;

	fs.exists(filename, function(exists) {
		if(exists) {
			console.log("serveFile: " + filename);
			res.set('Content-Type', content_type);
			var fileStream = fs.createReadStream(filename);
			fileStream.pipe(res);
		} else {
			console.log("serveFile - file not exists: " + filename);
			res.set('Content-Type', 'text/html');
			res.send(404, '<h1>404 Not Found</h1>');
		}
	});
}




function getHTML(req, res) {
	winston.debug("%s: %j", "getHTML", req.params, {});
	serveFile('app.html', 'text/html', res);
}

function getCSS(req, res) {
	winston.debug("%s: %j", "getCSS", req.params, {});
	serveFile('app.css', 'text/css', res);
}

function getJS(req, res) {
	winston.debug("%s: %j", "getJS", req.params, {});
	serveFile('app.js', 'application/javascript', res);
}


function setup(app) {
	app.get('/', getHTML);
	app.get('/web/app.css', getCSS);
	app.get('/web/app.js', getJS);
}

module.exports = setup
