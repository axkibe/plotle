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

                                   .---.
                                   \___  . ,-. ,-.
                                       \ | | | | |
                                   `---' ' `-| ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                            `'
 Signates an entry, string index or string span.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Sign;

/**
| Imports
*/
var Jools;

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
}

var check        = Jools.check;
var matches      = Jools.matches;
var reject       = Jools.reject;


/**
| Constructor
*/
Sign = function(model /*, ...*/) {
	var k;
	for(k in model) {
		if (!Object.hasOwnProperty.call(model, k))
			{ continue; }

		if (!Sign.field[k])
			{ throw reject('invalid Sign property: '+k); }

		this[k] = model[k];
	}

	for (var a = 1, aZ = arguments.length; a < aZ; a+=2) {
		k = arguments[a];
		if (!Sign.field[k])
			{ throw reject('invalid Sign property: '+k); }

		this[k] = arguments[a + 1];
	}

	Jools.immute(this);
};

/**
| List of keys allowed in a signature
*/
Sign.field = Jools.immute({
	'at1'   : true,
	'at2'   : true,
	'path'  : true,
	'proc'  : true,
	'rank'  : true,
	'val'   : true
});

/**
| Sets a new value of a signature.
| If the signature has the value preset, it checks equality.
|
| sign : signature to affix
| test : function to test existence of key (is or isnon)
| cm   : check message for failed checks
| base : base message for failed checks
| key  : key to affix at
| val  : value to affix
*/
Sign.prototype.affix = function(test, cm, base, key, val) {
	if (test(this[key])) {
		check(matches(val, this[key]), cm, base,'.',key,' faulty preset', val, '!==', this[key]);
		return this;
	}

	return new Sign(this, key, val);
};

/**
| Node
*/
if (typeof(window) === 'undefined') {
	module.exports = Sign;
}

}());
