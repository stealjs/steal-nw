var assert = require("assert");
var fse = require("fs-extra");
var exists = fse.existsSync;
var readFile = fse.readFileSync;
var helpers = require("./helpers");
var stealNW = require("../lib/main");
var cheerio = require("cheerio");

describe("steal-nw", function(){
	before(function(done){
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

	it("Adds env=nw-production to the steal script tag", function(){
		var src = readFile(__dirname + "/build/test/tests/app/production.html");
		var $ = cheerio.load(src);
		var env = $("script").attr("env");
		assert.equal(env, "nw-production", "The env attr was added");
	});

	it("The original main html doesn't have env=nw-production", function(){
		var src = readFile(__dirname + "/tests/app/production.html");
		var $ = cheerio.load(src);
		var env = $("script").attr("env");
		assert.equal(env, undefined, "There is no env attr");
	});
});
