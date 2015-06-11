var stealNw = require("../lib/main");
var stealTools = require("steal-tools");


var nwOptions = {
	buildDir: './build',
	platforms: ['osx'],
	files: ["./**/*"]
};

var buildPromise = stealTools.build({
	config: __dirname + "/package.json!npm"
});

buildPromise.then(function(){
	return stealNw(nwOptions);
});
