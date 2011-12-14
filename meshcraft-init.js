#!/usr/local/bin/node
/**
| Issues a set reqeust to the meshmashine.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var util       = require('util');
var libclient    = require('./meshcraft-libclient');

var j2o    = libclient.j2o;
var config = libclient.config();
if (config.initmessage) {
	console.log(config.initmessage);
}

var path = ["welcome"];

libclient.request({cmd: "now"}, function (err, now) {
	if (err) {
		console.log('Error: '+err.message);
		process.exit(1);
	}
	libclient.request({
	  cmd: 'alter',
	  time: now.time,
	  src: {
	    val: {
	      type: 'space',
	      items: {
	        '0' : {
	          type: 'note',
	          zone: {
	 	        pnw : { x: 100, y: 100 },
		        pse : { x: 300, y: 200 },
		      },
		      doc: {
		         alley : [
		          {
	                type: 'para',
	                text: 'If you can dream---and not make dreams your master;',
	              }, {
	                type: 'para',
	                text: 'If you can think---and not make thoughts your aim,',
	              }, {
	                type: 'para',
	                text: 'If you can meet with Triumph and Disaster',
	              }, {
	                type: 'para',
	                text: 'And treat those two impostors just the same',
	              },
	            ],
	          },
	        },
	      },
	      z : {
	        alley : [
	          0,
		    ],
	      },
	    },
	  },
	  trg: {
	    path: path,
	  },
	}, function(err, asw) {
		if (err) {
			console.log('Error: '+err.message);
			process.exit(1);
		}
		console.log(util.inspect(asw));
	});
});

