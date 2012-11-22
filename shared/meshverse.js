/*
|
| Meshcraft tree patterns.
|
| Authors: Axel Kittenberger
|
*/

/**
| Imports
*/
var Euclid;
var Jools;

/**
| Exports
*/
var Meshverse;

/**
| Capsule
*/
(function () {
"use strict";

// node imports
if (typeof (window) === 'undefined') {
	Euclid = {
		Point  : require('./euclid/point'),
		Rect   : require('./euclid/rect')
	};

	Jools  = require('./jools');
}

/**
| The meshcraft universe
*/
Meshverse =
{
	'Space' :
	{
		copse :
		{
			'Label'    : true,
			'Note'     : true,
			'Portal'   : true,
			'Relation' : true
		},
		ranks : true
	},

	'Note' :
	{
		must :
		{
			'doc'      : 'Doc',
			'zone'     : 'Rect',
			'fontsize' : 'Number'
		}
	},

	'Portal' :
	{
		must :
		{
			'zone'      : 'Rect',
			'spaceUser' : 'String',
			'spaceTag'  : 'String'
		}
	},

	'Label' :
	{
		must :
		{
			'doc'      : 'Doc',
			'pnw'      : 'Point',
			'fontsize' : 'Number'
		}
	},

	'Relation' :
	{
		must :
		{
			'doc'      : 'Doc',
			'pnw'      : 'Point',
			'item1key' : 'Key',
			'item2key' : 'Key',
			'fontsize' : 'Number'
		}
	},

	'Doc' :
	{
		copse : { 'Para' : true },
		ranks : true
	},

	'Para' :
	{
		must : { 'text' : 'String' }
	},

	'Rect' :
	{
		creator :
		function(t)
		{
			return new Euclid.Rect( 'o', t );
		},

		must :
		{
			'pnw' : 'Point',
			'pse' : 'Point'
		}
	},

	'Point' :
	{
		creator :
		function(t)
		{
			return new Euclid.Point(t.x, t.y);
		},

		must :
		{
			'x' : 'Integer',
			'y' : 'Integer'
		}
	}
};

/**
| Some sanity tests on the patterns.
*/
(function(patterns)
{
	for(var k in patterns)
	{
		var p = patterns[k];

		Jools.immute(p);

		if (p.copse)
			{ Jools.immute(p.copse); }

		if (p.must)
			{ Jools.immute(p.must); }

		if (p.must)
		{
			if (p.copse)
				{ throw new Error('Patterns must not have .must and .copse'); }

			if (p.must.index)
				{ throw new Error('indexOf must not be a must'); }
		}

		if (p.ranks && !p.copse)
				{ throw new Error('Patterns must not have .ranks without .copse'); }
	}

})(Meshverse);

/**
| Node export
*/
if (typeof(window) === 'undefined')
	{ module.exports = Meshverse; }

})();

