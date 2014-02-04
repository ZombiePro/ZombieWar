/**
 * Created by tomasj on 29/01/14.
 */

var winston = require("winston");
//winston.add(winston.transports.File, {filename: '../app.log', level: 'debug'}).remove(winston.transports.Console);
var mongo = require('./mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');

function createUser(req, res) {
    winston.debug("%s: %j", "createUser request, body:", req.body, {});
    var doc = {};
    doc.email = "email" in req.body ? req.body.email : res.send(400, "Please specify an email");
    doc.nick = "nick" in req.body ? req.body.nick : "";
    doc.details = "details" in req.body ? req.body.details : {name: "", surname: "", gender: "", age: ""};
    doc.friends = "friends" in req.body ? req.body.friends : new Array();
    doc.photoId = ObjectId("newObjectId1");
    mongo.execute(mongo.methods.insert, mongo.collections.accounts, null, doc, function(err, data) {
        if (err) throw err;
        res.set("Content-Type", "application/json");
        // as insert returns a cursor object (an array more or less) so we have to use data[0] to access the result
        res.send(201, {id: data[0]._id, email: data[0].email});
    });
}

// should be internal - not even sure it should exist :P
function getUsers(req, res) {
    winston.debug("%s: %j", "getUsers request, params", req.params, {});
    mongo.execute(mongo.methods.find, mongo.collections.accounts, null, {}, function(err, data){
        if (err) throw err;
        res.set("Content-Type", "application/json");
        res.send(200, data);
    })
}

function getUser(req, res) {
    winston.debug("%s: %j", "getUser request, params", req.params, {});
    var doc = {_id: ObjectId(req.params.id)}
    mongo.execute(mongo.methods.findOne, mongo.collections.accounts, null, doc, function(err, data) {
        if (err) throw err;
        res.set("Content-Type", "application/json");
        res.send(200, data);
    });
}

function getUserFriends(req, res) {
    winston.debug("%s: %j", "getUserFriends request, params", req.params, {});
    var doc = {_id: ObjectId(req.params.id)}
    mongo.execute(mongo.methods.findOne, mongo.collections.accounts, null, doc, function(err, data) {
        if (err) throw err;
        res.set("Content-Type", "application/json");
        res.send(200, {friends: data.friends});
    });
}

function modifyUser(req, res) {
    winston.debug("%s: %j, %s: %j", "modifyUsers request, param", req.params, "body", req.body, {});
    var userData = {};
    if ("email" in req.body) userData.email =  req.body.email;
    if ("nick" in req.body) userData.nick =  req.body.nick;
    if ("details" in req.body) userData.details =  req.body.details;
    if (userData != {}) {
        mongo.execute(mongo.methods.update, mongo.collections.accounts, {_id: ObjectId(req.params.id)}, {$set: userData}, function(err, data) {
            if (err) throw err;
            res.set("Content-Type", "application/json");
            res.send(204, {});
        });
    }
}

function addFriends(req, res) {
    winston.debug("%s: %j, %s: %j", "modifyUsers request, params", req.params, "body", req.body, {});
    if ("friends" in req.body) {
        var userFriends = {$addToSet : { friends: { $each: req.body.friends}}};
        if (userFriends != {}) {
            mongo.execute(mongo.methods.update, mongo.collections.accounts, {_id: ObjectId(req.params.id)}, userFriends, function(err, data) {
                if (err) throw err;
                res.set("Content-Type", "application/json");
                res.send(204, {});
            });
        }
    }
    else {
        res.set("Content-Type", "application/json");
        res.send(400, {error: "parameter missing", message: "friends param required"});
    }
}

function setup(app) {
    app.post('/api/users', express.bodyParser(), createUser);
    app.get('/api/users', getUsers);
    app.get('/api/users/:id', getUser);
    app.get('/api/users/:id/friends', getUserFriends);
    app.put('/api/users/:id/friends', express.bodyParser(), addFriends);
    app.put('/api/users/:id', express.bodyParser(), modifyUser);
}

module.exports = setup
