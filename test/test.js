var assert = require("assert");
var fse = require("fs-extra");
var exists = fse.existsSync;
var helpers = require("./helpers");
var stealNW = require("../lib/main");

describe("steal-nw", function(){
	beforeEach(function(done){
		helpers.rmdir(__dirname + "/build")
		.then(function(){
			var nwOptions = {
				buildDir: __dirname + "/build",
				version: "latest",
				platforms: ["osx64"],
				files: [
					"test/tests/app/package.json",
					"test/tests/app/production.html"
				]
			};

			var buildResult = {
				configuration: {
					dest: __dirname + "/tests/app/dist"
				}
			};

			helpers.stubNWBuilder(stealNW);

			var fin = function() { done(); }
			stealNW(nwOptions, buildResult).then(fin, done);
		});
	});

	it("Copies over the production files", function(){
		assert(exists(__dirname + "/build/test/tests/app/package.json"));
		assert(exists(__dirname + "/build/test/tests/app/production.html"));
	});
});
