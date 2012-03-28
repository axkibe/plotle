/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                             ,-_/ .-,--'            .---.
                             '  |  \|__ ,-. ,-. ,-. \___  . . ,-. ,-.
                             .^ |   |   ,-| |   |-'     \ | | | | |
                             `--'  `'   `-^ `-' `-' `---' `-| ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                          `-'
 Peer interface that talks in a synchronous way with the server.
 Used for debugging (testpad).

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Path;
var Patterns;
var Tree;
var Jools;

/**
| Exports
*/
var IFaceSync;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') throw new Error('IFaceSync nees a browser!');

var debug     = Jools.debug;
var log       = Jools.log;
var is        = Jools.is;

/**
| Constructor
*/
IFaceSync = function() {
	this.remoteTime = false;
};

/**
| Gets a twig.
*/
IFaceSync.prototype.get = function(path, len) {
	// shortens the path
	if (is(len)) { path = new Path(path, '--', path.length - len); }

	var r = this._getSync(this.remoteTime, path);
	return {
		node : is(r.node) ? new Tree(r.node, Patterns.mUniverse).root : null,
		time : r.time
	};
};

/**
| Alters the tree.
*/
IFaceSync.prototype.alter = function(src, trg) {
	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', false);
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var request = JSON.stringify({
		time : this.remoteTime,
		cmd  : 'alter',
		src  : src,
		trg  : trg
	});
	log('peer', '->', request);
	ajax.send(request);

	var asw = ajax.responseText;
	log('peer', '<-', asw);
	try {
		asw = JSON.parse(asw);
	} catch (e) {
		throw new Error('Server answered no JSON!');
	}
	if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
	return asw;
};

/**
| Goes forth/back in time
*/
IFaceSync.prototype.toTime = function(time) {
	this.remoteTime = time;
};

/**
| Issues a synchronous get request.
*/
IFaceSync.prototype._getSync = function(time, path) {
	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', false);
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var request = JSON.stringify({
		time : time,
		cmd  : 'get',
		path : path
	});
	log('peer', 'gs->', request);
	ajax.send(request);
	var asw = ajax.responseText;
	log('peer', '<-gs', asw);
	try {
		asw = JSON.parse(asw);
	} catch (e) {
		throw new Error('Server answered no JSON!');
	}
	if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
	return asw;
};



})();
