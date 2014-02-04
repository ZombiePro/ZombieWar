/**
 * Created by tomasj on 28/01/14.
 */

var collections = {accounts: "accounts"}
var methods = {insert: insert, save: save, findOne: findOne, find: find, findAndModify: findAndModify, update: update}

var winston = require("winston");
var mongoClient = require('mongodb').MongoClient;
var async = require('async');
var conn = null;

function execute(method, col, criteria, doc, cb) {
    getConnection(function(err){
        if (err) cb(err, null);
        switch(method) {
            case methods.find: find(col, doc, cb); break;
            case methods.findOne: findOne(col, doc, cb); break;
            case methods.insert: insert(col, doc, cb); break;
            case methods.save: save(col, doc, cb); break;
            case methods.update: update(col, criteria, doc, cb); break;
            case methods.findAndModify: findAndModify(col, criteria, doc, cb); break;
        }
    })
}

// I'm not sure whether getConnection should be called by each of the mongoCtrl method internally or should it be called
// by other modules before calling the actual mongoCtrl method like insert or find
function getConnection(callback) {
    if (conn) {
        winston.info("Connection established previously, reusing connection")
        return callback(null);
    }
    else {
       async.whilst(
        function() {
            if (conn == null) winston.info("Connection is null, establishing...")
            return conn == null;
        },
        function (call) {
            mongoClient.connect("mongodb://127.0.0.1:27017/zombiewar", function(err, db) {
                if (err) throw err;
                conn = db;
                winston.info("DB connection established");
                return callback(null);
            })
            setTimeout(call, 1000);
        },
        function(err) {
            if (err) return callback(err);
        });
    }
}

function insert(col, doc, cb) {
    winston.debug("%s %j %s %s", "going to insert:", doc, "to", col, {});
    var collection = conn.collection(col);
    collection.insert(doc, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "insert successful");
        winston.debug("%s: %j", "document inserted", docs, {});
        cb(null, docs); // return a cursor object
    });
};

function save(col, doc, cb) {
    winston.debug("%s %j %s %s", "going to save:", doc, "to", col, {});
    var collection = conn.collection(col);
    collection.save(doc, {safe: true}, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "save successful");
        winston.debug("%s: %j", "document created/modified", docs, {});
        cb(null, docs); // return an int - the number of documents changed
    });
};

function findAndModify(col, criteria, doc, cb) {
    winston.debug("%s %j %s %s", "going to findAndModify:", doc, "to", col);
    var collection = conn.collection(col);
    collection.findAndModify(criteria, doc, {new: true, upsert: false}, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "findAndModify successful", {});
        winston.debug("%s: %j", "document found and modified", docs, {});
        cb(null, docs); // return an int - the number of documents changed
    });
};

function update(col, criteria, doc, cb) {
    winston.debug("%s %j %s %s", "going to update:", doc, "to", col, {});
    var collection = conn.collection(col);
    collection.update(criteria, doc, {upsert: false}, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "update successful", {});
        winston.debug("%s: %j", "document updated", docs, {});
        cb(null, docs); // return an int - the number of documents changed
    });
}

function findOne(col, doc, cb) {
    winston.debug("%s %j %s %s", "going to findOne:", doc, "to", col, {});
    var collection = conn.collection(col);
    collection.findOne(doc, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "findOne successful", {});
        winston.debug("%s: %j", "record found", docs, {});
        cb(null, docs); // returns a single document
    });
}

function find(col, doc, cb) {
    winston.debug("%s %j %s %s", "going to find:", doc, "to", col, {});
    var collection = conn.collection(col);
    collection.find(doc, function(err, docs) {
        if (err) cb(err, null);
        winston.info("%s '%s': %s", "collection", col, "find successful", {});
        // docs - is a cursor object, we have to convert it into an Array to be able to return it
        // WARNING / TODO: paging is necesasry as "toArray" loads the whole collection into memory
        docs.toArray(function(err, data) {
            if (err) cb(err, null);
            winston.debug("%s: %d", "record(s) found", data.length, {});
            cb(null, data);
        })
    });
}

//exports.getConnection = getConnection;
//exports.insert = insert;
//exports.save = save;
//exports.findOne = findOne;
//exports.find = find;
exports.execute = execute;
exports.collections = collections;
exports.methods = methods;
