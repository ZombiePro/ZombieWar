/**
 * Created by tomasj on 28/01/14.
 */
var log = require("winston").loggers.get("app:mongoCtrl");
var mongoClient = require('mongodb').MongoClient;
var async = require('async');
var conn = null;

function getConnection(callback) {
    if (conn) {
        log.info("Connection established previously, returning conn")
        return callback(null, conn);
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
                return callback(null, conn);
            })
            setTimeout(call, 1000);
        },
        function(err) {
            if (err) throw err;
        });
    }
}

function insert(conn, col, doc) {
    log.debug("going to insert: " + doc + " to " + col);
    var collection = conn.collection(col);
    collection.insert(doc, function(err, docs) {
        if (err) log.error(err);
        log.debug("insert successfull");
    });
};

function findOne(conn, col, doc) {
    var collection = conn.collection(col);
    collection.findOne(doc, console.log);
}

exports.getConnection = getConnection;
exports.insert = insert;
exports.findOne = findOne