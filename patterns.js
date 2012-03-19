/**
| Meshcraft Tree patterns.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

/**
| Imports
*/
var Fabric;

/**
| Exports
*/
var Patterns;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') {
	// node imports
	Fabric = require('./fabric');
}

/**
| Patterns are the rules a tree must abide to.
*/
Patterns = {};

/**
| The meshcraft universe
*/
Patterns.mUniverse = {
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
		//inc   : true
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

	'Doc' : {
		copse : { 'Para' : true },
		ranks : true
		//inc   : true
	},

	'Para' : {
		must : { 'text' : 'String' }
	},

	'Rect' : {
		creator : function(t) {
			return new Fabric.Rect(t.pnw, t.pse);
		},

		must : {
			'pnw' : 'Point',
			'pse' : 'Point'
		}
	},

	'Point' : {
		creator : function(t) {
			return new Fabric.Point(t.x, t.y);
		},

		must : {
			'x' : 'Number', // @@ Integer
			'y' : 'Number'
		}
	}
};

/**
| Some sanity tests on the patterns.
| @@ this might be disabled in release mode.
*/
(function(patterns) {
	for(var k in patterns) {
		var p = patterns[k];

		// TODO turn on immuting
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


if (typeof(window) === 'undefined') {
	module.exports = Patterns;
}

})();

