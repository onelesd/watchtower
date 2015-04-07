var assert          = require("assert");
var nock            = require("nock");
var endpointChecker = require("../lib/watchtower/endpointChecker.js");

describe("EndpointChecker", function() {
  var checker = new endpointChecker();

  describe("#validate()", function() {
    nock("http://bbc.co.uk").get("/test-url").reply(200, "OK");
    var endpoints = [
      {
        site: "BBC",
        url: "http://bbc.co.uk/test-url"
      }
    ];

    it("should return successful results object.", function() {
      var expected_results = [
        {
          status: 200,
          endpoint: endpoints[0],
          site: endpoints[0].site
        }
      ];
      checker.validate(endpoints, function(results) {
        assert.equal(results, expected_results);
      });
    });
  });
})
