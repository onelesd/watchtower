var clc = require("cli-color");

function Logger() {};

Logger.error = function(msg) {
  var text = clc.red("[ERROR] ") + clc.white(timestamp()) + " " + msg;
  output(text);
};

Logger.info = function(msg) {
  var text = clc.cyan("[INFO] ") + clc.white(timestamp()) + " " + msg;
  output(text);
};

var output = function(text) {
  if (process.env.APP_ENV != "test") {
    console.log(text);
  }
};

var timestamp = function() {
  return new Date().toTimeString();
};

module.exports = Logger;
