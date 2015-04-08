<h1 align="center">Watchtower</h1>

<p align="center">
  <a href="https://travis-ci.org/revett/watchtower" target="_blank"><img src="https://img.shields.io/travis/revett/watchtower.svg?style=flat-square"></a>
  <a href="https://coveralls.io/r/revett/watchtower" target="_blank"><img src="https://img.shields.io/coveralls/revett/watchtower.svg?style=flat-square"></a>
</p>

<p align="center">
  <b>Monitors</b> your site and posts <b>downtime</b> to <b><a href="https://slack.com/">Slack</a></b>.
</p>

### What is this?

A simple Node package which checks the status of links on your site, and posts any outages to Slack. This is heavily based upon the **[Linkey](https://github.com/DaveBlooman/linkey)** gem written by **[@daveblooman](https://github.com/daveblooman)**.

### Install

```
npm install watchtower-js
```

### Usage

First create a **config.yaml** (see section below), then:

```js
var watchtower  = require("watchtower-js");
var config_path = "/path/to/config.yaml";

new watchtower(config_path).start();
```

or run from the **command-line**:

```
watchtower /path/to/config.yaml
```

### Config

```yaml
slack_webhook_url: "https://hooks.slack.com/services/xxxxx/xxxxx/xxxxx"
sites:
  - name: "BBC"
    base: "http://bbc.co.uk"
    endpoints:
      - path: "/news"
      - path: "/news/election/2015"
  - name: "Guardian"
    base: "http://theguardian.com"
    endpoints:
      - path: "/uk"

```

### Tests

```
npm install && npm install -g mocha
```

```
APP_ENV=test mocha tests/
```

### Licence

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2015 [Charlie Revett](http://twitter.com/charlierevett)
