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
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'
                                 ,--. .                   ,.  ,.
                                | `-' |-. ,-. ,-. ,-. ,-. ` \/ '
                                |   . | | ,-| | | | | |-'   /\
                                `--'  ' ' `-^ ' ' `-| `-' `'  `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                   `'
 An array of changes to a tree.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Change;


/**
| Exports
*/
var ChangeX;

/**
| Capsule
*/
(function() {
"use strict";

/**
| Node includes.
*/
if (typeof(window) === 'undefined') {
	Jools  = require('./jools');
	Change = require('./change');
}

var debug        = Jools.debug;
var log          = Jools.log;
var immute       = Jools.immute;
var innumerable  = Jools.innumerable;
var is           = Jools.is;
var isnon        = Jools.isnon;
var subclass     = Jools.subclass;

/**
| Constructor:
|
|   Change(src, trg)  -or-
|   Change(o)  where o contains o.src and o.trg
*/
ChangeX = function() {
};
subclass(ChangeX, Array);

/**
| Returns a reversed change.
*/
ChangeX.prototype.reverse = function() {
	if (is(this._reverse)) { return this._reverse; }
	var r = new ChangeX();
	for(var a = 0, aZ = this.length; a < aZ; a++) {
		r[a] = this[a].reverse();
	}

	innumerable(this, '_reverse', r);
	innumerable(r, '_reverse', this);
	return r;
};

/**
| Exports
*/
if (typeof(window) === 'undefined') {
	module.exports = ChangeX;
}

}());
