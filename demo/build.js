var stealNw = require("../lib/main");
var stealTools = require("steal-tools");


var nwOptions = {
	buildDir: './build',
	platforms: ['osx'],
	files: ["./**/*"]
};

stealNw(nwOptions).then(function(){
	console.log("build complete");
}, function(err){
	console.error("OH NO:", err);
});
