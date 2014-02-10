/**
 * Created by tomasj on 29/01/14.
 */

var winston = require("winston");
//winston.add(winston.transports.File, {filename: '../app.log', level: 'debug'}).remove(winston.transports.Console);
var mongo = require('./mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var async = require('async');
//var emailRegex = /([\w.-]+)(?=@tid\.es|@telefonica\.com)/;
var validate = require('./validateData');

function _createUser(req, callback) {
    var doc = {};
    doc.email = req.body.email;
    doc.nick = req.body.nick || "";
    doc.name = req.body.name || "";
    doc.surname = req.body.surname || "";
    doc.gender = req.body.gender || "Male";
    doc.age = req.body.age || 100;
    doc.friends = req.body.friends || new Array();
    doc.photoId = ObjectId("newObjectId1");
    mongo.execute(mongo.methods.insert, mongo.collections.accounts, null, doc, null, function(err, data) {
        if (err) callback(err, null);
        // as insert returns a cursor object (an array more or less) so we have to use data[0] to access the result
        callback(null, {id: data[0]._id, email: data[0].email})
    });
}

function createUser(req, res) {
    winston.debug("%s: %j", "createUser request, body:", req.body, {});
    async.series({
        validateEmail: function(callback) {
            validate.emailRequired(req, callback);
        },
        doCreateUser: function(callback) {
            _createUser(req, callback)
        }
    },
    function(err, result) {
        res.set("Content-Type", "application/json");
        if (err) res.send(400, err);
        else res.send(201, result.doCreateUser)
    });
}

// should be internal - not even sure it should exist :P
function getUsers(req, res) {
    winston.debug("%s: %j", "getUsers request, params", req.params, {});
    mongo.execute(mongo.methods.find, mongo.collections.accounts, null, {}, null, function(err, data){
        if (err) throw err;
        res.set("Content-Type", "application/json");
        res.send(200, data);
    })
}

function getUser(req, res) {
    winston.debug("%s: %j", "getUser request, params", req.params, {});
    async.series({
        validateId: function(callback) {
            validate.objectId(req, callback)
        },
        doGetUser: function(callback) {
            var doc = {_id: ObjectId(req.params.id)}
            mongo.execute(mongo.methods.findOne, mongo.collections.accounts, null, doc, null, function(err, data) {
                if (err) callback(err, null);
                callback(null, data);
            });
        }
    },
    function(err, result) {
        res.set("Content-Type", "application/json");
        if (err) res.send(400, err);
        else res.send(201, result.doGetUser);
    });
}

function getUserFriends(req, res) {
    winston.debug("%s: %j", "getUserFriends request, params", req.params, {});
    async.series({
        validateId: function(callback) {
            validate.objectId(req, callback)
        },
        doGetUserFriends: function(callback) {
            var doc = {_id: ObjectId(req.params.id)}
            mongo.execute(mongo.methods.findOne, mongo.collections.accounts, null, doc, {friends: 1}, function(err, data) {
                if (err) callback(err, null);
                callback(null, data);
            });
        }
    },
    function(err, result) {
        res.set("Content-Type", "application/json");
        if (err) res.send(400, err);
        else res.send(201, result.doGetUserFriends);
    });
}

function _modifyUser(req, callback) {
    var userData = {};
    if ("email" in req.body) userData.email =  req.body.email;
    if ("nick" in req.body) userData.nick =  req.body.nick;
    if ("name" in req.body) userData.name =  req.body.name;
    if ("surname" in req.body) userData.surname =  req.body.surname;
    if ("gender" in req.body) userData.gender =  req.body.gender;
    if ("age" in req.body) userData.age =  req.body.age;
    mongo.execute(mongo.methods.update, mongo.collections.accounts, {_id: ObjectId(req.params.id)}, {$set: userData}, {upsert: false}, function(err, data) {
        if (err) callback(err, null);
        else callback(null, {})
    });
}

function modifyUser(req, res) {
    winston.debug("%s: %j, %s: %j", "modifyUsers request, param", req.params, "body", req.body, {});
    async.series( {
        validateId: function(callback) {
            validate.objectId(req, callback)
        },
        validateBody: function(callback) {
            validate.body(req, callback);
        },
        validateEmail: function(callback) {
            validate.emailOptional(req, callback);
        },
        doModifyUser: function(callback) {
            _modifyUser(req, callback);
        }
    },
    function(err, result) {
        res.set("Content-Type", "application/json");
        if (err) res.send(400, err);
        else res.send(200, result.doModifyUser);
    });
}

function _addFriends(req, callback) {
    if ("friends" in req.body) {
        var userFriends = {$addToSet : { friends: { $each: req.body.friends}}};
        mongo.execute(mongo.methods.update, mongo.collections.accounts, {_id: ObjectId(req.params.id)}, userFriends, {}, function(err, data) {
            if (err) callback(err, null);
            callback(null, {});
        });
    }
    else callback({error: "parameter missing", message: "friends param required"}, null);
}

function addFriends(req, res) {
    winston.debug("%s: %j, %s: %j", "modifyUsers request, params", req.params, "body", req.body, {});
    async.series({
        validateId: function(callback) {
            validate.objectId(req, callback)
        },
        doAddFriends: function(callback) {
            _addFriends(req, callback);
        }
    },
    function(err, result) {
        res.set("Content-Type", "application/json");
        if (err) res.send(400, err);
        else res.send(200, result.doAddFriends);
    });
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
