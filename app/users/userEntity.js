/**
 * Created by tomasj on 12/02/14.
 */

function userBuilder() {
    this.doc = {};
}

userBuilder.prototype.email = function(email) {
    this.doc.email = email;
    return this;
}

userBuilder.prototype.nick = function(nick) {
    this.doc.nick = nick;
    return this;
}

userBuilder.prototype.name = function(name) {
    this.doc.name = name;
    return this;
}

userBuilder.prototype.surname = function(surname) {
    this.doc.surname = surname;
    return this;
}

userBuilder.prototype.gender = function(gender) {
    this.doc.gender = gender;
    return this;
}

userBuilder.prototype.age = function(age) {
    this.doc.age = age;
    return this;
}

userBuilder.prototype.friends = function(friends) {
    this.doc.friends = friends;
    return this;
}

userBuilder.prototype.build = function() {
    return new User(this);
}

function User(builder) {
    this.doc = builder.doc;
}

User.prototype.getJson = function() {
//    console.log("returning json", this.doc);
    return this.doc;
}

module.exports.userBuilder = userBuilder;

