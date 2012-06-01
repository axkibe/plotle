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

                          ,-,-,-.           .
                          `,| | |   ,-. ,-. |-. .  , ,-. ,-. ,-. ,-.
                            | ; | . |-' `-. | | | /  |-' |   `-. |-'
                            '   `-' `-' `-' ' ' `'   `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Meshcraft tree patterns.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Euclid;
var Fabric;
var Point;
var Rect;

/**
| Exports
*/
var Meshverse;

/**
| Capsule
*/
(function () {
"use strict";

if (typeof (window) === 'undefined') {
	// node imports
	Euclid = require('./euclid/euclid');
	Point  = require('./euclid/point');
	Rect   = require('./euclid/rect');
}

/**
| The meshcraft universe
*/
Meshverse = {
	'Nexus' : {
		copse : { 'Space' : true }
	},

	'Space' : {
		copse : {
			'Note'     : true,
			'Label'    : true,
			'Relation' : true
		},
		ranks : true
	},

	'Note' : {
		must : {
			'doc'      : 'Doc',
			'zone'     : 'Rect',
			'fontsize' : 'Number'
		}
	},

	'Label' : {
		must : {
			'doc'      : 'Doc',
			'pnw'      : 'Point',
			'fontsize' : 'Number'
		}
	},

	'Relation' : {
		must : {
			'doc'      : 'Doc',
			'pnw'      : 'Point',
			'item1key' : 'Key',
			'item2key' : 'Key',
			'fontsize' : 'Number'
		}
	},

	'Doc' : {
		copse : { 'Para' : true },
		ranks : true
	},

	'Para' : {
		must : { 'text' : 'String' }
	},

	'Rect' : {
		creator : function(t) {
			return new Rect(t.pnw, t.pse);
		},

		must : {
			'pnw' : 'Point',
			'pse' : 'Point'
		}
	},

	'Point' : {
		creator : function(t) {
			return new Point(t.x, t.y);
		},

		must : {
			'x' : 'Number', // @@ Integer
			'y' : 'Number'
		}
	}
};

/**
| Some sanity tests on the patterns.
*/
/*
(function(patterns) {
	for(var k in patterns) {
		var p = patterns[k];

		// @@ turn on immuting
		// immute(p)
		//if (p.copse) immute(p.copse);
		//if (p.must) immute(p.must);

		if (p.must) {
			if (p.copse) throw new Error('Patterns must not have .must and .copse');
			if (p.must.index) throw new Error('indexOf must not be a must');
		}
		if (p.ranks && !p.copse) throw new Error('Patterns must not have .ranks without .copse');
	}
})(Patterns.mUniverse);
*/

if (typeof(window) === 'undefined') {
	module.exports = Meshverse;
}

})();

