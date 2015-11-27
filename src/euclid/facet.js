/*
| A facet of an element.
|
| for example hover, focus or down.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_facet',
		attributes :
		{
			border :
			{
				comment : 'border',
				type :
					require( '../typemaps/border' )
					.concat( [ 'undefined' ] )
			},
			fill :
			{
				comment : 'fill',
				type :
					require( '../typemaps/fill' )
					.concat( [ 'undefined' ] )
			}
		},
		group : [ 'boolean' ]
	};
}


var
	euclid_facet;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_facet.prototype;


})( );
