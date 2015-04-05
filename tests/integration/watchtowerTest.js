var fs         = require("fs");
var path       = require("path");
var watchtower = require("../../lib/watchtower.js");

var config_path = path.join(path.dirname(fs.realpathSync(__filename)), "../fixtures") + "/config.yaml";
watchtower.startWatch(config_path);
