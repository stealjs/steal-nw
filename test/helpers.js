var copy = require("copy");
var fse = require("fs-extra");

exports.rmdir = function(pth){
	return new Promise(function(resolve, reject){
		fse.remove(pth, function(err){
			if(err) return reject(err);
			resolve();
		});
	});
};

exports.stubNWBuilder = function(stealNW, buildCallback){
	stealNW.makeNWBuilder = function(options){
		return {
			on: function(){},
			build: function(br, cb){
				var p = Promise.all(
					options.files.map(function(src){
						return new Promise(function(resolve, reject){
							copy(src, options.buildDir, function(err){
								if(err) return reject(err);
								resolve();
							});
						});
					})
				);

				p.then(function() { cb(); });
			}
		}
	};
};
