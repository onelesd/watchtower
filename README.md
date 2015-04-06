<h1 align="center">Watchtower</h1>

<p align="center">
  <a href="https://travis-ci.org/revett/watchtower" target="_blank"><img src="https://img.shields.io/travis/revett/watchtower.svg?style=flat-square"></a>
</p>

<p align="center">
  <b>Monitors</b> your site and posts <b>downtime</b> to <b><a href="https://slack.com/">Slack</a></b>.
</p>

### What is this?

A very simple package which checks the status of links on your site, and posts any outages to Slack. This is heavily based upon the **[Linkey](https://github.com/DaveBlooman/linkey)** gem written by **[@daveblooman](https://github.com/daveblooman)**.

### Install

```
npm install watchtower
```

### Usage

First create a **config.yaml** (see section below), then:

```js
var watchtower  = require("watchtower");
var config_path = "/path/to/config.yaml";

watchtower.startWatch(config_path);
```

or run from the **command-line**:

```
watchtower /path/to/config.yaml
```

### Config

```yaml
sites:
  - name: "BBC"
    base: "http://bbc.co.uk"
    endpoints:
      - name: "News Home Page"
        path: "/news"
      - name: "Election 2015 Home Page"
        path: "/news/election/2015"
  - name: "Guardian"
    base: "http://theguardian.com"
    endpoints:
      - name: "UK Home Page"
        path: "/uk"

```

### Tests

```
npm install && npm install -g mocha
```

```
mocha tests/
```

### Licence

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2015 [Charlie Revett](http://twitter.com/charlierevett)
