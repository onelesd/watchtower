var _    = require("underscore");
var fs   = require("fs");
var yaml = require("js-yaml");

function ConfigParser(path) {
  this.path = path;
};

ConfigParser.prototype.parse = function() {
  try {
    var parsed = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));
    return merged_sites(parsed.sites);
  } catch (e) {
    console.log(e);
  }
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
    page_name: endpoint.name,
    url: (site.base + endpoint.path)
  }
};

module.exports = ConfigParser;
