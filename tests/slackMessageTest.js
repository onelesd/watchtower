var assert = require("assert");
var msg    = require("../lib/watchtower/slack/message.js");

describe("Slack::Message", function() {
  describe("#new()", function() {
    var results = ["test"];
    var message = new msg(results);

    it("should set results instance variable.", function() {
      assert.equal(results, message.results);
    });
  });

  describe("#payload()", function() {
    var results = [
      {
        status: 200,
        site: "Google",
        time: 65,
        endpoint: {
          url: "http://google.com"
        }
      },
      {
        status: 404,
        site: "BBC",
        time: 65,
        endpoint: {
          url: "http://bbc.co.uk/news/batman"
        }
      },
      {
        status: 500,
        site: "BBC",
        time: 65,
        endpoint: {
          url: "http://bbc.co.uk/server_error"
        }
      }
    ];
    var message = new msg(results);
    var expected_payload = {
      text: "*2* of *3* endpoints failed. Checked *2* sites.",
      attachments: [
        {
          fallback: "List of failed endpoints",
          color: "danger",
          text: "404 - http://bbc.co.uk/news/batman\n500 - http://bbc.co.uk/server_error"
        }
      ]
    };

    it("should parse results to payload.", function() {
      assert.deepEqual(expected_payload, message.payload());
    });
  });
})
