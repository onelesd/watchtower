"use strict"

var yaml = require("js-yaml");
var fs   = require("fs");

function ConfigParser(path) {
  this.path = path;
};

ConfigParser.prototype.parse = function() {
  try {
    return yaml.safeLoad(fs.readFileSync(this.path, "utf8"));
  } catch (e) {
    console.log(e);
  }
};

module.exports = ConfigParser;
