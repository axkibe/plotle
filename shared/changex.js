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

/**
| FIXME subclassing Array is not a good idea.
|
| Constructor:
|
|   Change(src, trg)  -or-
|   Change(o)  where o contains o.src and o.trg
*/
ChangeX = function() {
};
Jools.subclass(ChangeX, Array);

/**
| Returns an array with inverted changes.
*/
ChangeX.prototype.invert = function() {
	if (Jools.is(this._invert))
		{ return this._invert; }

	var r = new ChangeX();
	for(var a = 0, aZ = this.length; a < aZ; a++) {
		r[a] = this[a].invert();
	}

	Jools.innumerable(this, '_invert', r);
	Jools.innumerable(r, '_invert', this);
	return r;
};

/**
| Exports
*/
if (typeof(window) === 'undefined') {
	module.exports = ChangeX;
}

}());
