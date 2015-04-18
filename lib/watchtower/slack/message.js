var _ = require("lodash");

function Message(results) {
  this.results = results;
};

Message.prototype.payload = function() {
  return {
    text: failure_message(this.results) + " " + total_message(this.results),
    attachments: [
      {
        fallback: "List of failed endpoints",
        color: "danger",
        text: attachments(this.results)
      }
    ]
  };
};

var attachments = function(results) {
  return _.map(failures(results), function(r) {
    return r.status + " - " + r.endpoint.url;
  }).join("\n");
};

var failures = function(results) {
  return _.reject(results, function(r) { return r.status == 200; });
};

var failure_message = function(results) {
  return "*" + failures(results).length + "* of *" + results.length + "* endpoints failed.";
};

var sites = function(results) {
  sites = _.groupBy(results, function(r) { return r.site; });
  return _.keys(sites).length;
};

var total_message = function(results) {
  return "Checked *" + sites(results) + "* sites.";
};

module.exports = Message;
