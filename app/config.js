/**
 * Created by tomasj on 29/01/14.
 */


var config = module.exports;
var PRODUCTION = process.env.NODE_ENV === "production";

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: "localhost"
};

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost'
};
if (PRODUCTION) {
    config.express = {
      port: process.env.EXPRESS_PORT || 3000,
      ip: process.env.EXPRESS_IP || "localhost"
    };

    config.mongodb = {
      port: process.env.MONGODB_PORT || 27017,
      host: process.env.MONGODB_HOST || 'localhost',
      auth: false,
      user: process.env.MONGODB_USER || 'admin',
      pass: process.env.MONGODB_PASS || 'holapapi'
    };
}
//config.db same deal
//config.email etc
//config.log
