/*
| Meshcraft tree patterns.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Euclid,
	Jools;


/*
| Exports
*/
var
	Meshverse;


/*
| Capsule
*/
( function( ) {
"use strict";

// node imports
if( typeof( window ) === 'undefined')
{
	Euclid = {
		Point :
			require('./euclid/point'),

		Rect :
			require('./euclid/rect')
	};

	Jools =
		require('./jools');
}


/*
| The meshcraft universe
*/
Meshverse =
{
	'Space' :
	{
		twig :
		{
			'Label' :
				true,

			'Note' :
				true,

			'Portal' :
				true,

			'Relation' :
				true
		},

		ranks :
			true
	},

	'Note' :
	{
		must :
		{
			'doc' :
				'Doc',

			'zone' :
				'Rect',

			'fontsize' :
				'Number'
		}
	},

	'Portal' :
	{
		must :
		{
			'zone' :
				'Rect',

			'spaceUser' :
				'String',

			'spaceTag' :
				'String'
		}
	},

	'Label' :
	{
		must :
		{
			'doc' :
				'Doc',

			'pnw' :
				'Point',

			'fontsize' :
				'Number'
		}
	},

	'Relation' :
	{
		must :
		{
			'doc' :
				'Doc',

			'pnw' :
				'Point',

			'item1key' :
				// 'Key', FIXME
				'String',

			'item2key' :
				// 'Key', FIXME
				'String',

			'fontsize' :
				'Number'
		}
	},

	'Doc' :
	{
		twig :
		{
			'Para' :
				true
		},

		ranks :
			true
	},

	'Para' :
	{
		must :
		{
			'text' :
				'String'
		}
	},

	'Rect' :
	{
		must :
		{
			'pnw' :
				'Point',

			'pse' :
				'Point'
		}
	},

	'Point' :
	{
		must :
		{
			'x' :
				'Integer',

			'y' :
				'Integer'
		}
	}
};


/*
| Some sanity tests on the patterns.
*/
( function( patterns )
{
	for( var k in patterns )
	{
		var p =
			patterns[ k ];

		Jools.immute( p );

		if( p.twig )
		{
			Jools.immute( p.twig );
		}

		if( p.must )
		{
			Jools.immute( p.must );
		}

		if( p.must )
		{
			if( p.twig )
			{
				throw new Error( 'Patterns must not have .must and .twig' );
			}

			if( p.must.index )
			{
				throw new Error( 'index must not be a must' );
			}
		}

		if( p.ranks && !p.twig )
		{
			throw new Error( 'Patterns must not have .ranks without .twig' );
		}
	}

} )( Meshverse );

/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports = Meshverse;
}

} )( );

