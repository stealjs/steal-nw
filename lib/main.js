var NwBuilder = require("nw-builder");
var asap = require("pdenodeify");
var path = require("path");
var rimraf = require("rimraf");

module.exports = function(options, buildResult){
	var nwOptions = {};

	// Convert the options to camelcase
	Object.keys(options).forEach(function(optName){
		nwOptions[toCamelcase(optName)] = options[optName];
	});

	// Set the bundlesPath as a file to use.
	var files = nwOptions.files || nwOptions.glob || [];
	files = Array.isArray(files) ? files : [files];

	var buildConfig = buildResult && buildResult.configuration;
	var destPath = buildConfig && (buildConfig.dest || buildConfig.bundlesPath);

	if(destPath) {
		var globPath = path.relative(process.cwd(), destPath) + "/**/*";
		files.unshift(globPath);
	}
	nwOptions.files = files;

	var nw = new NwBuilder(nwOptions);

	nw.on("log", function(msg){
		console.error(msg);
	});

	var buildPromise = asap(rimraf)(nwOptions.buildDir);

	var builder = asap(nw.build.bind(nw));
	return buildPromise.then(builder);
};


function toCamelcase(str) {
	return str.replace(/\_+([a-z])/g, function (x, chr) { return chr.toUpperCase(); });
}
