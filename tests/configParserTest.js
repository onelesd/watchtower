var assert       = require("assert");
var configParser = require("../lib/watchtower/configParser.js");

describe("configParser", function() {
  var path   = "./tests/fixtures/config.yaml";
  var parser = new configParser(path);

  describe("#new()", function() {
    it("should set path instance variable.", function() {
      assert.equal(path, parser.path);
    });
  });

  describe("#parse()", function() {
    var config = {
      "test": "config"
    }

    it("should parse YAML.", function() {
      assert.deepEqual(config, parser.parse());
    });
  });
})
