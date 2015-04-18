var _    = require("underscore");
var fs   = require("fs");
var log  = require("./logger.js");
var yaml = require("js-yaml");

function ConfigParser(path) {
  check_path(path);
  this.path = path;
};

ConfigParser.prototype.parse = function() {
  try {
    var parsed = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));
    return to_hash(parsed);
  } catch (e) {
    log.error("Failed to parse config.")
    log.error(e);
  }
};

var check_path = function(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    log.error("Config YAML not found.");
    process.exit(1);
  }
};

var key_exist = function(hash, key) {
  return _.has(hash, key);
};

var merged_sites = function(sites) {
  var merged = [];
  _.each(sites, function(site) {
    _.each(site.endpoints, function(endpoint) {
      merged.push(merged_endpoint(site, endpoint));
    });
  });
  return merged;
};

var merged_endpoint = function(site, endpoint) {
  return {
    site: site.name,
    url: (site.base + endpoint)
  }
};

var to_hash = function(parsed) {
  return {
    endpoints: merged_sites(parsed.sites),
    max_concurrent: (parsed.max_concurrent || 5),
    slack: {
      enabled: key_exist(parsed, "slack_webhook_url"),
      webhook_url: (parsed.slack_webhook_url || false),
      channel: (parsed.slack_channel || "#general")
    }
  };
};

module.exports = ConfigParser;
