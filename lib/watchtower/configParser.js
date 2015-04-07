var _    = require("underscore");
var fs   = require("fs");
var yaml = require("js-yaml");

function ConfigParser(path) {
  this.path = path;
};

ConfigParser.prototype.parse = function() {
  try {
    var parsed = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));
    return to_hash(parsed);
  } catch (e) {
    console.log(e);
  }
};

var add_interval = function(hash, parsed) {
  if (hash.loop) {
    hash.interval = parsed.interval;
  }
  return hash;
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
    url: (site.base + endpoint.path)
  }
};

var to_hash = function(parsed) {
  var hash = {
    loop: is_looped(parsed),
    endpoints: merged_sites(parsed.sites)
  };
  return add_interval(hash, parsed);
};

var is_looped = function(parsed) {
  return _.has(parsed, "interval");
};

module.exports = ConfigParser;
