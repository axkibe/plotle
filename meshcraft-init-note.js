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
	console.log('meshcraft-init-dtext SIGN');
	process.exit(1);
}

var sign;
try {
	sign = JSON.parse(process.argv[2]);
} catch(err) {
	console.log('signature not valid JSON');
	process.exit(1);
}
if (!(sign instanceof Array)) sign = [sign];

libemsi.request({cmd: "now"}, function (err, now) {
	if (err) {
		console.log('Error: '+err.message);
		process.exit(1);
	}
	libemsi.request({
			cmd: 'alter',
			time: now.time,
			src: {
				val: {
					'type': 'note',
					'zone': {
						'pnw' : { 'x': 100, 'y': 100 },
						'pse' : { 'x': 300, 'y': 200 },
					},
					'doc': [
						{
							'type':  'para',
							'text%': 'If you can dream---and not make dreams your master;',
						}, {
							'type': 'para',
							'text%': 'If you can think---and not make thoughts your aim,',
						}, {
							'type':  'para',
							'text%': 'If you can meet with Triumph and Disaster',
						}, {
							'type': 'para',
							'text%': 'And treat those two impostors just the same',
						},
					],
				},
			},
			trg: {
				sign: sign,
			}
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

