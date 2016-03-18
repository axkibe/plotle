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
		id : 'gleam_facet',
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
	gleam_facet;


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

prototype = gleam_facet.prototype;


})( );