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

                      ,-_/ .-,--'           .-,--.           .      .
                      '  |  \|__ ,-. ,-. ,-. `\__  ,-,-. . . |  ,-. |- ,-.
                      .^ |   |   ,-| |   |-'  /    | | | | | |  ,-| |  |-'
                      `--'  `'   `-^ `-' `-' '`--' ' ' ' `-^ `' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Peer inteface that emulates a server.
 Used for development.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Emulate;
var MeshMashine;
var Path;
var Patterns;
var Tree;
var Jools;

/**
| Exports
*/
var IFaceEmulate;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') throw new Error('Peer nees a browser!');

var Change    = MeshMashine.Change;
var Signature = MeshMashine.Signature;
var debug     = Jools.debug;
var log       = Jools.log;
var is        = Jools.is;

/**
| Constructor.
*/
IFaceEmulate = function() {
	this.tree    = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.history = [];
	this.report  = null;
	this.alter(Emulate.src, { path: new Path(Emulate.path) });
};

/**
| Gets a twig
*/
IFaceEmulate.prototype.get = function(path, len) {
	return this.tree.getPath(path, len);
};


IFaceEmulate.prototype.alter = function(src, trg) {
	var chg = new Change(new Signature(src), new Signature(trg));
	var r = MeshMashine.changeTree(this.tree, chg);
	this.tree = r.tree;
	var chgX = r.chgX;

	for (var a = 0, aZ = chgX.length; a < aZ; a++) {
		this.history.push(chgX[a]);
	}

	if (this.report) { this.report.report('update', r.tree, chgX); }
	return chgX;
};


})();
