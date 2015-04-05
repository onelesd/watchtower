var assert       = require("assert");
var configParser = require("../lib/watchtower/configParser.js");

describe("ConfigParser", function() {
  var path   = "./tests/fixtures/config.yaml";
  var parser = new configParser(path);

  describe("#new()", function() {
    it("should set path instance variable.", function() {
      assert.equal(path, parser.path);
    });
  });

  describe("#parse()", function() {
    var config = [
      {
        site: "BBC",
        page_name: "News",
        url: "http://bbc.co.uk/news"
      },
      {
        site: "Guardian",
        page_name: "Sport",
        url: "http://theguardian.com/uk/sport"
      }
    ]

    it("should parse YAML.", function() {
      assert.deepEqual(config, parser.parse());
    });
  });
})
