/**
 * Created by tomasj on 28/01/14.
 */

var collections = {accounts: "accounts"}
var methods = {insert: insert, save: save, findOne: findOne, find: find}

var log = require("winston").loggers.get("app:mongoCtrl");
var mongoClient = require('mongodb').MongoClient;
var async = require('async');
var conn = null;

function execute(method, col, doc, cb) {
    getConnection(function(err){
        if (err) cb(err, null);
        switch(method) {
            case methods.find: find(col, doc, cb); break;
            case methods.findOne: findOne(col, doc, cb); break;
            case methods.insert: insert(col, doc, cb); break;
            case methods.save: save(col, doc, cb); break;
        }
    })
}

// I'm not sure whether getConnection should be called by each of the mongoCtrl method internally or should it be called
// by other modules before calling the actual mongoCtrl method like insert or find
function getConnection(callback) {
    if (conn) {
        log.info("Connection established previously, returning conn")
        return callback(null);
    }
    else {
       async.whilst(
        function() {
            if (conn == null) log.debug("Connection is null, establishing...")
            return conn == null;
        },
        function (call) {
            mongoClient.connect("mongodb://127.0.0.1:27017/zombiewar", function(err, db) {
                if (err) throw err;
                conn = db;
                log.info("db connection established");
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
    log.debug("going to upsert: " + doc + " to " + col);
    var collection = conn.collection(col);
    collection.insert(doc, function(err, docs) {
        if (err) cb(err, null);
        log.info("collection:", col, "insert successful");
        log.debug("document created/modified: ", JSON.stringify(docs, null, 4));
        cb(null, docs); // return a cursor object
    });
};

function save(col, doc, cb) {
    log.debug("going to save: ", doc, " to ", col);
    var collection = conn.collection(col);
    collection.save(doc, {safe: true}, function(err, docs) {
        if (err) cb(err, null);
        log.info("collection:", col, "save successful");
        log.debug("document created/modified: ", JSON.stringify(docs, null, 4));
        cb(null, docs); // return an int - the number of documents changed
    });
};

function findOne(col, doc, cb) {
    log.debug("going to findOne: ", doc, " in ", col);
    var collection = conn.collection(col);
    collection.findOne(doc, function(err, docs) {
        if (err) cb(err, null);
        log.info("collection: ", col, "findOne successful");
        log.debug("record found: ", JSON.stringify(docs, null, 4));
        cb(null, docs); // returns a single document
    });
}

function find(col, doc, cb) {
    log.debug("going to find: ", doc, " in ", col);
    var collection = conn.collection(col);
    collection.find(doc, function(err, docs) {
        if (err) cb(err, null);
        log.info("collection: ", col, "find successful");
        // docs - is a cursor object, we have to convert it into an Array to be able to return it
        // WARNING / TODO: paging is necesasry as "toArray" loads the whole collection into memory
        docs.toArray(function(err, data) {
            if (err) cb(err, null);
            log.debug("record(s) found: ", data.length);
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
