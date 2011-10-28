#!/usr/local/bin/node
/**
| Issues a set reqeust to the meshmashine.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var util       = require('util');
var libemsi    = require('./meshcraft-libclient');

var j2o    = libemsi.j2o;
var config = libemsi.config();
if (config.initmessage) {
	console.log(config.initmessage);
}

if (process.argv.length < 3) {
	console.log(process.argv[0]+' PATH');
	process.exit(1);
}

var path;
try {
	path = JSON.parse(process.argv[2]);
} catch(err) {
	console.log('path not valid JSON');
	process.exit(1);
}
if (!(path instanceof Array)) path = [path];

libemsi.request({cmd: "now"}, function (err, now) {
	if (err) {
		console.log('Error: '+err.message);
		process.exit(1);
	}
	libemsi.request({
			cmd: "set",
			time: now.time,
			path: path,
			val: [
				{ type: 'para', text: 'If you can dream---and not make dreams your master;', },
				{ type: 'para', text: 'If you can think---and not make thoughts your aim,',  },
				{ type: 'para', text: 'If you can meet with Triumph and Disaster',           },
				{ type: 'para', text: 'And treat those two impostors just the same',         },
			],
		},
		function(err, asw) {
			if (err) {
				console.log('Error: '+err.message);
				process.exit(1);
			}
			console.log(util.inspect(asw));
		}
	);
});

