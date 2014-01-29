/**
 * Created by tomasj on 29/01/14.
 */

var log = require("winston").loggers.get("app:users");
var mongo = require('./mongoCtrl');
var express = require('express');

function createUser(req, res) {
    log.debug("createUser request: " + req.body)
    var doc = {}
    if ("email" in req.body){
        doc.email = req.body.email;
    }
    else {
        res.send(400, "Please specify an email");
    }
    if ("nick" in req.body){
        doc.nick = req.body.nick;
    }
    if ("details" in req.body){
        doc.details = req.body.details;
    }
    if ("friends" in req.body){
        doc.friends = req.body.friends;
    }
    doc.photoId = "newObjectID";
    console.log("doc: " + JSON.stringify(doc, null, 4));
    mongo.getConnection(function(err, conn) {
        if(err) throw err;
        mongo.insert(conn, "accounts", doc);
        res.send(201, "User created successfully");
    })
}

function getUsers(req, res) {
    if ("email" in req.query) {
        res.send("searching for: " + req.query.email)
    }
    res.send("this is the right place");
}

function setup(app) {
    app.post('/api/users', express.bodyParser(), createUser);
    app.get('/api/users', getUsers);
}

module.exports = setup