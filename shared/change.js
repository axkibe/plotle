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

                                   ,--. .
                                  | `-' |-. ,-. ,-. ,-. ,-.
                                  |   . | | ,-| | | | | |-'
                                  `--'  ' ' `-^ ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                     `'
 A change to a tree.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Path;
var Sign;

/**
| Exports
*/
var Change = null;

/**
| Capsule
*/
(function() {
"use strict";

/**
| Node includes.
*/
if (typeof(window) === 'undefined') {
	Jools = require('./jools');
	Path  = require('./path');
	Sign  = require('./sign');
}

var is           = Jools.is;
var isPath       = Path.isPath;

/**
| Constructor:
|
|   Change(src, trg)  -or-
|   Change(o)  where o contains o.src and o.trg
*/
Change = function(a1, a2) {
	var src, trg;
	switch (arguments.length) {
	case 2:
		src = a1;
		trg = a2;
		break;
	case 1:
		src = a1.src;
		trg = a1.trg;
		break;
	default :
		throw new Error('#argument fail');
	}

	if (src.constructor === Sign) {
		this.src = src;
	} else {
		if (src.path && !isPath(src.path))
			{ src.path = new Path(src.path); }

		this.src = new Sign(src);
	}

	if (trg.constructor === Sign) {
		this.trg = trg;
	} else {
		if (trg.path && !isPath(trg.path))
			{ trg.path = new Path(trg.path); }

		this.trg = new Sign(trg);
	}

	Jools.immute(this);
};

/**
| Returns the type of an Alternation.
*/
Change.prototype.type = function() {
	if (is(this._type)) { return this._type; }

	var src = this.src;
	var trg = this.trg;
	var type;

	if (trg.proc === 'splice')
		{ type = 'split';  }
	else if (src.proc === 'splice')
		{ type = 'join';   }
	else if (is(src.val) && !is(trg.at1))
		{ type = 'set';    }
	else if (is(src.val) &&  is(trg.at1))
		{ type = 'insert'; }
	else if (is(src.at1) &&  is(src.at2) && !is(trg.at1))
		{ type = 'remove'; }
	else if (is(trg.rank))
		{ type = 'rank';   }
	else {
		type = null;
		if (Jools.prissy) {
			Jools.log('fail', this);
			throw new Error('invalid type');
		}
	}

	Jools.innumerable(this, '_type', type);
	return type;
};

/**
| Returns a inverted change.
*/
Change.prototype.invert = function() {
	if (is(this._invert)) { return this._invert; }
	var r = new Change(this.trg, this.src);
	Jools.innumerable(this, '_invert', r);
	Jools.innumerable(r, '_invert', this);
	return r;
};

/**
| Change emulates an Array with the length of 1
*/
Change.prototype.length = 1;
Object.defineProperty(Change.prototype, 0, {
	get: function() { return this; }
});

/**
| Exports
*/
if (typeof(window) === 'undefined') {
	module.exports = Change;
}

}());
