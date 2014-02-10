/**
 * Created by tomasj on 5/02/14.
 */

var ObjectId = require('mongodb').ObjectID;
var emailRegex = /([\w.-]+)(?=@tid\.es$|@telefonica\.com$)/;
var objectIdRegex = /^[a-f0-9]{24}$/;

function objectId(req, cb) {
    if ("id" in req.params && objectIdRegex.test(req.params.id)) cb(null, "ok");
    else cb({error: "parameter incorrect", message: "id must be a single String of 12 bytes or a string of 24 hex characters"}, null);
}

function emailRequired(req, cb) {
    if ("email" in req.body && emailRegex.test(req.body.email)) cb(null, "ok");
    else cb({error: "parameter missing or incorrect", message: "specify a valid email"}, null)
}

function emailOptional(req, cb) {
    if ("email" in req.body) {
        if (emailRegex.test(req.body.email)) cb(null, "ok");
        else cb({error: "parameter incorrect", message: "specify a valid email"}, null)
    }
    else cb(null, "ok");
}

function body(req, cb) {
    if (Object.keys(req.body).length > 0) cb(null, "ok");
    else cb({error: "parameter missing", message: "specify at least one parameter to be changed"}, null);
}

exports.objectId = objectId;
exports.emailRequired = emailRequired;
exports.emailOptional = emailOptional;
exports.body = body;