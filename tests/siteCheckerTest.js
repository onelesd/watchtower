var assert      = require("assert");
var nock        = require("nock");
var siteChecker = require("../lib/watchtower/siteChecker.js");

describe("siteChecker", function() {
  var base    = "http://bbc.co.uk";
  var checker = new siteChecker(base);

  describe("#new()", function() {
    it("should set base instance variable.", function() {
      assert.equal(base, checker.base);
    });
  });

  describe("#validate()", function() {
    var bbc = nock("http://bbc.co.uk")
              .get("/test-url")
              .reply(200, "OK");
    var endpoints = [
      {
        name: "Test #1",
        path: "/test-url"
      }
    ];

    it("should return successful results object.", function() {
      var expected_results = [
        {
          status: 200,
          endpoint: endpoints[0]
        }
      ];
      checker.validate(endpoints, function(results) {
        assert.equal(results, expected_results);
      });
    });
  });
})
