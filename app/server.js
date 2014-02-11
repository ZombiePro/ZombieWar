/**
 * Created by tomasj on 28/01/14.
 */
var config =  require('./config');
var winston = require("winston");
winston.add(winston.transports.File, {filename: '../app.log', level: 'debug'}).remove(winston.transports.Console);
var express = require('express');
var app = express();

//var AUTOUSING_THE_ROUTER_IS_A_NUISANCE = app.router;
//Load the routes ("controllers" -ish)
["./users/routes", './web/routes'].forEach(function (routePath) {
    require(routePath)(app);
});

//OK, routes are loaded, NOW use the router:
app.use(app.router);


app.listen(config.express.port, config.express.ip, function (error) {
  if (error) {
    winston.error("Unable to listen for connections", error);
    process.exit(10);
  }
  winston.info("express is listening on http://" +
    config.express.ip + ":" + config.express.port);
});
