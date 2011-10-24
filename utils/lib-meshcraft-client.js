#!/usr/local/bin/node
/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´


	LibEmSi (MC)

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Commutil utilities for mc-clients

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var http = require('http');

/**
| Get default configs.
*/
var _config;
var config = module.exports.config = function() {
	if (_config) return _config;
	try {
		console.log(process.arguments[1]);
		return _config = require('./config');
	} catch(err) {
		return _config = {
			ip   : '127.0.0.1',
			port : 8833,
			initmessage : 'config.js not found. defaulting to localhost:8833',
		};
	}
}

/**
| Converts a JSON string to object
*/
module.exports.j2o = function(s) {
	try {
		return JSON.parse(s);
	} catch(err) {
		return null;
	}
}

/**
| Options to connect to meshmashine
*/
var mmops = {
	host: config().ip,
	port: config().port,
	path: '/mm',
	method: 'POST'
};

/**
| Issues an ajax request.
*/
module.exports.request = function(cmd, callback) {
	var req = http.request(mmops, function(res) {
		if (res.statusCode !== 200) {
			callback(new Error('Status code: '+res.statusCode));
			return;
		}
		res.setEncoding('utf8');
		var data = [];
		res.on('data', function(chunk) {
			data.push(chunk);
		});
		res.on('end', function() {
			var asw = data.join('');
			var ao;
			try {
				ao = JSON.parse(asw);
			} catch (err) {
				callback(err);
				return;
			}
			if (ao.ok) {
				callback(null, ao);
			} else {
				callback(new Error(ao.message));
			}
		});
	});
	req.on('error', function(err) {
		callback(err);
	});
	req.write(JSON.stringify(cmd));
	req.end();
}

module.exports.update = function(time, callback) {
	request({
		cmd: 'update',
		time: time}, callback);
}

module.exports.set = function(time, path, value) {
	request({
		cmd: 'set',
		path: path,
		value: value}, callback);
}

