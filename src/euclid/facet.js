/*
| A facet of an element.
|
| for example hover, focus or down.
*/


var
	euclid_facet;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return{
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_facet.prototype;


})( );
