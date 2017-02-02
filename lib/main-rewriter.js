var cheerio = require("cheerio");
var fse = require("fs-extra");
var path = require("path");
var asap = require("pdenodeify");

var readFile = asap(fse.readFile);
var writeFile = asap(fse.writeFile);

module.exports = MainRewriter;

function MainRewriter(nwOptions){
	this.nwOptions = nwOptions;
	this.root = process.cwd();

	this.restore = this.restore.bind(this);
}

MainRewriter.prototype = {
	/*
	 * Rewrites the production.html file
	 * so that the env=nw-production
	**/
	rewrite: function(){
		var main = this.main = this.findMain();
		// If the main isn't an .html file we can't rewrite anything.
		if(!main) {
			return;
		}

		return readFile(main, "utf8")
		.then(function(src){
			this.originalSource = src;

			var $ = cheerio.load(src);
			var stealScript;
			$("script").each(function(idx, el){
				var $el = $(el);
				var src = $el.attr("src");
				if(/steal\.production\.js/.test(src)) {
					stealScript = $el;
					return false;
				}
			});

			if(stealScript) {
				stealScript.attr("env", "nw-production");
				return writeFile(main, $.html(), "utf8")
			}
		}.bind(this))
		.catch(function(){
			// We don't want the copy to fail just because of this
		})

	},

	restore: function(){
		if(!this.originalSource) {
			return Promise.resolve();
		}
		if(this.hasRestored) {
			return Promise.resolve();
		}

		this.hasRestored = true;

		fse.writeFileSync(this.main, this.originalSource, "utf8");
		return Promise.resolve();
	},

	findMain: function(){
		var files = this.nwOptions.files || [], file;
		for(var i = 0, len = files.length; i < len; i++) {
			file = files[i];
			if(/package\.json/.test(file)) {
				break;
			}
		}

		if(file) {
			var pth = path.join(this.root, file);
			try {
				var pkg = require(pth);
				var main = pkg.main;
				if(/\.html/.test(main)) {
					return path.join(pth, "..", main);
				}
			} catch(er){}
		}
	}
};
