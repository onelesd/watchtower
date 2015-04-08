var assert       = require("assert");
var configParser = require("../lib/watchtower/configParser.js");

describe("ConfigParser", function() {
  describe("#new()", function() {
    var path   = "./tests/fixtures/config.yaml";
    var parser = new configParser(path);

    it("should set path instance variable.", function() {
      assert.equal(path, parser.path);
    });
  });

  describe("#parse()", function() {
    describe("Basic", function() {
      var config = {
        loop: {
          enabled: false
        },
        slack: {
          enabled: false
        },
        endpoints: [
          {
            site: "BBC",
            url: "http://bbc.co.uk/news"
          },
          {
            site: "BBC",
            url: "http://bbc.co.uk/music"
          },
          {
            site: "Guardian",
            url: "http://theguardian.com/uk/sport"
          }
        ]
      };
      var path   = "./tests/fixtures/config.yaml";
      var parser = new configParser(path);

      it("should parse YAML.", function() {
        assert.deepEqual(config, parser.parse());
      });
    });

    describe("loop mode", function() {
      describe("enabled", function() {
        var config = {
          loop: {
            enabled: true,
            interval: 5000
          },
          slack: {
            enabled: false
          },
          endpoints: [
            {
              site: "BBC",
              url: "http://bbc.co.uk/news"
            },
            {
              site: "BBC",
              url: "http://bbc.co.uk/music"
            },
            {
              site: "Guardian",
              url: "http://theguardian.com/uk/sport"
            }
          ]
        };
        var path   = "./tests/fixtures/loop_config.yaml";
        var parser = new configParser(path);

        it("should parse YAML.", function() {
          assert.deepEqual(config, parser.parse());
        });
      });
    });

    describe("Slack mode", function() {
      describe("enabled", function() {
        var config = {
          loop: {
            enabled: false
          },
          slack: {
            enabled: true,
            webhook_url: "http://test-url.slack.com"
          },
          endpoints: [
            {
              site: "BBC",
              url: "http://bbc.co.uk/news"
            },
            {
              site: "BBC",
              url: "http://bbc.co.uk/music"
            },
            {
              site: "Guardian",
              url: "http://theguardian.com/uk/sport"
            }
          ]
        };
        var path   = "./tests/fixtures/slack_config.yaml";
        var parser = new configParser(path);

        it("should parse YAML.", function() {
          assert.deepEqual(config, parser.parse());
        });
      });
    });
  });
})
