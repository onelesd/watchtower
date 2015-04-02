"use strict"

var configParser = require("./watchtower/configParser.js");
var siteChecker  = require("./watchtower/siteChecker.js");

function startWatch() {
  var config = new configParser("config.yaml").parse();
  var sites  = config.sites
  for (var s in sites) {
    var checker = new siteChecker(sites[s].base);
    checker.validate(sites[s].endpoints);
  }
};

exports.startWatch = startWatch;
