var NwBuilder = require("node-webkit-builder");
var asap = require("pdenodeify");

module.exports = function(options, buildResult){
	var nwOptions = {};

	// Convert the options to camelcase
	Object.keys(options).forEach(function(optName){
		nwOptions[toCamelcase(optName)] = options[optName];
	});

	// TODO fix this
	//nwOptions.files = this.filesSrc;

	var nw = new NwBuilder(nwOptions);

	nw.on("log", function(msg){
		console.error(msg);
	});

	var build = nw.build.bind(nw);
	return asap(build)();
};


function toCamelcase(str) {
	return str.replace(/\_+([a-z])/g, function (x, chr) { return chr.toUpperCase(); });
}
