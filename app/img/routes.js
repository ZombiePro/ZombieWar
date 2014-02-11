/**
 * Created by gerardooscarjt on 11/02/2014
*/

'use strict';

var	winston = require("winston"),
	path = require('path'),
	fs = require('fs'),
	sanitize = require("sanitize-filename");

var base_dir = path.dirname(module.filename) + path.sep;

var mimetypes = {
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
};

function is_image(filename) {
	var ext = path.extname(filename).toLowerCase();
	return ext in mimetypes;
}

function get_mimetype(filename) {
	var ext = path.extname(filename).toLowerCase();
	return mimetypes[ext];
}

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

function serveImage(req, res) {
	var filename = sanitize(req.params.filename);

	if (is_image(filename)) {
		console.log('SERVE FILEEEE!');
		serveFile(filename, get_mimetype(filename), res);
	} else {
		console.log("serveImage - Type not supported: " + filename);
		res.set('Content-Type', 'text/html');
		res.send(404, '<h1>404 Not Found</h1>');		
	}
}

function serveList(req, res) {
	fs.readdir(base_dir, function(err, data) {
		var out = '<style type="text/css">body {font-family: sans-serif;}.box {display: block; overflow: hidden; border: solid silver 1px;	width: 128px;	height: 0px;	padding-top:128px;	margin: 8px;	float: left;	background-repeat: no-repeat; background-position: center center; background-size: contain; background-color: #F8F8F8; box-shadow: 0 0 8px rgba(0,0,0,0.1); color: black; text-decoration: none; text-align: center;}.box:hover { box-shadow: 0 0 10px rgba(0,0,0,0.6); overflow: visible; text-shadow: 1px 1px 2px white;}</style>';
		for (var i in data) {
			var filename = data[i];
			if (is_image(filename)) {
				out += '<a href="' + filename + '" class="box" style="background-image:url(' + filename + ')">' + filename + '</a>';
			}
		}
		res.set('Content-Type', 'text/html');
		res.send(200, out);
	});
}

function setup(app) {
	app.get('/img/:filename', serveImage);
	app.get('/img/', serveList);
}

module.exports = setup
