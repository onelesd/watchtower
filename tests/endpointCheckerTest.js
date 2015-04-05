var assert          = require("assert");
var nock            = require("nock");
var endpointChecker = require("../lib/watchtower/endpointChecker.js");

describe("EndpointChecker", function() {
  var checker = new endpointChecker();

  describe("#validate()", function() {
    var bbc = nock("http://bbc.co.uk")
              .get("/test-url")
              .reply(200, "OK");
    var endpoints = [
      {
        site: "BBC",
        page_name: "Test #1",
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