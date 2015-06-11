[![npm version](https://badge.fury.io/js/steal-nw.svg)](http://badge.fury.io/js/steal-nw)

# steal-nw

Create [NW.js](http://nwjs.io/) applications from StealJS projects.

## Install

```shell
npm install steal-nw --save-dev
```

## Example

Pass [NWOptions](#nwoptions) and [StealTools.BuildResult](http://stealjs.com/docs/steal-tools.BuildResult.html) to steal-nw:

```js
var stealTools = require("steal-tools");
var stealNw = require("steal-nw");

var nwOptions = {
  buildDir: "./build",
  platforms: ["osx"],
  files: ["./**/*"]
};

var buildPromise = stealTools({
  config: __dirname + "/package.json!npm"
});

buildPromise.then(function(buildResult){
	stealNw(nwOptions, buildResult);
});
```

## API

`stealNw(nwOptions, buildResult) -> Promise`

### NWOptions

NW.js options are passed as the first argument are the same as documented on [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder).

### BuildResult

The [result](http://stealjs.com/docs/steal-tools.build.html) of running StealTools multi-build.

## License

MIT
