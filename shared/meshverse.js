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
	Meshverse,
	meshverse;


/*
| Capsule
*/
( function( ) {
"use strict";

// node imports
if( typeof( window ) === 'undefined')
{
	Jools =
		require('./jools');
}

/*
| The meshcraft universe
*/
Meshverse =
	function( )
	{

	};



Meshverse.prototype.Space =
	Jools.immute( {

		twig :
			Jools.immute ( {

				'Label' :
					true,

				'Note' :
					true,

				'Portal' :
					true,

				'Relation' :
					true
		} ),

		ranks :
			true
	} );


Meshverse.prototype.Note =
	Jools.immute( {

		must :
			Jools.immute( {

				'doc' :
					'Doc',

				'zone' :
					'Rect',

				'fontsize' :
					'Number'

			} )

	} );

Meshverse.prototype.Portal =
	Jools.immute( {

		must :
			Jools.immute( {

				'zone' :
					'Rect',

				'spaceUser' :
					'String',

				'spaceTag' :
					'String'

			} )

	} );


Meshverse.prototype.Label =
	Jools.immute( {

		must :
			Jools.immute( {

				'doc' :
					'Doc',

				'pnw' :
					'Point',

				'fontsize' :
					'Number'

			} )

	} );


Meshverse.prototype.Relation =
	Jools.immute( {

		must :
			Jools.immute( {

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
			} )

	} );


Meshverse.prototype.Doc =
	Jools.immute( {

		twig :
			Jools.immute( {
				'Para' :
					true
			} ),

		ranks :
			true

	} );


Meshverse.prototype.Para =
	Jools.immute( {

		must :
			Jools.immute( {

				'text' :
					'String'

			} )

	} );


Meshverse.prototype.Rect =
	Jools.immute( {

		must :
			Jools.immute( {

				'pnw' :
					'Point',

				'pse' :
					'Point'

			} )

	} );


Meshverse.prototype.Point =
	Jools.immute( {

		must :
			Jools.immute( {

				'x' :
					'Integer',

				'y' :
					'Integer'

			} )

	} );


/*
| Some sanity tests on the patterns.
*/
if( CHECK )
{
	for( var k in Meshverse.prototype )
	{
		var
			p =
				Meshverse.prototype[ k ];

		if( p.must )
		{
			if( p.twig )
			{
				throw new Error(
					'Patterns must not have .must and .twig'
				);
			}
		}

		if( p.ranks && !p.twig )
		{
			throw new Error(
				'Patterns must not have .ranks without .twig'
			);
		}
	}
}

meshverse =
	new Meshverse( );


/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports =
		meshverse;
}

} )( );

